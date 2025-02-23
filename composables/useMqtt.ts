// composables/useMqtt.ts
import mqtt, { MqttClient } from 'mqtt';
import { useDevicesStore } from '~/stores/devices';
import {ref} from 'vue'

// Обработчик метаданных устройства
function handleDeviceMeta(payload: string, deviceName: string) {
    const store = useDevicesStore();
    if (payload === '') {
        store.removeDevice(deviceName);
    } else {
        const meta = JSON.parse(payload);
        if (store.devices[deviceName]?.meta) {
            store.devices[deviceName].meta = meta;
        }
    }
}

// Обработчик метаданных контролла
function handleControlMeta(payload: string, deviceName: string, controlName: string) {
    const store = useDevicesStore();
    if (payload === '') {
        store.removeControl(deviceName, controlName);
    } else {
        const meta = JSON.parse(payload);
        store.devices[deviceName].controls[controlName] = {
            name: controlName,
            type: meta.type,
            value: meta.type === 'text' ? '' : 0,
            meta,
        };
    }
}

// Обработчик ошибок устройства
function handleDeviceError(payload: string, deviceName: string) {
    const store = useDevicesStore();
    store.setDeviceError(deviceName, payload || null);
}

// Обработчик ошибок контролла
function handleControlError(payload: string, deviceName: string, controlName: string) {
    const store = useDevicesStore();
    store.setControlError(deviceName, controlName, payload || null);
}

// Обработчик значений контролла
function handleControlValue(payload: string, deviceName: string, controlName: string) {
    const store = useDevicesStore();
    if (store.devices[deviceName].controls[controlName]) {
        store.updateControl(deviceName, controlName, payload);
    }
}


export const useMqtt = createSharedComposable(() => {
    const { public: {mqttBroker} } = useRuntimeConfig()

    const connected = ref(false);
    const connectionStatus = ref < 'connected' | 'reconnecting' | 'offline' > ('offline')
    const store = useDevicesStore();
    const client = ref<MqttClient | null>(null)



    // Определение маршрутов с регулярными выражениями
    const routes: Array<{
        pattern: RegExp;
        handler: (topic: string, payload: string, deviceName: string, controlName?: string) => void;
    }> = [
        {
            pattern: /^\/devices\/([^/]+)\/meta$/,
            handler: (topic, payload, deviceName) => handleDeviceMeta(payload, deviceName),
        },
        {
            pattern: /^\/devices\/([^/]+)\/controls\/([^/]+)\/meta$/,
            handler: (topic, payload, deviceName, controlName) => handleControlMeta(payload, deviceName, controlName!),
        },
        {
            pattern: /^\/devices\/([^/]+)\/meta\/error$/,
            handler: (topic, payload, deviceName) => handleDeviceError(payload, deviceName),
        },
        {
            pattern: /^\/devices\/([^/]+)\/controls\/([^/]+)\/meta\/error$/,
            handler: (topic, payload, deviceName, controlName) =>
                handleControlError(payload, deviceName, controlName!),
        },
        {
            pattern: /^\/devices\/([^/]+)\/controls\/([^/]+)$/,
            handler: (topic, payload, deviceName, controlName) =>
                handleControlValue(payload, deviceName, controlName!),
        },
    ];



    function init() {
        client.value = mqtt.connect(mqttBroker, { clientId: 'test-client-vue'});


        // Обновление статуса на основе событий MQTT
        client.value.on('connect', () => {
            if (!connected.value) {
                subscribeToTopics();
                console.log('Connected to MQTT broker');
            }
            connected.value = true;
            connectionStatus.value = 'connected'
        })
        client.value.on('reconnect', () => {
            console.log('Reconnecting to MQTT broker');
            connectionStatus.value = 'reconnecting'
        })
        client.value.on('offline', () => {
            console.log('Offline offline');
            connectionStatus.value = 'offline'
        })
        client.value.on('close', () => {
            console.log('Closed');
            connectionStatus.value = 'offline'
        })

        client.value.on('message', (topic, message) => {
            const payload = message.toString();

            for (const route of routes) {
                const match = topic.match(route.pattern);
                if (match) {
                    const [, deviceName, controlName] = match; // Захватываем группы из регулярного выражения
                    if (!store.devices[deviceName] && !topic.endsWith('/meta')) {
                        // Пропускаем, если устройство не существует и это не /meta
                        break;
                    }
                    if (!store.devices[deviceName] && topic.endsWith('/meta')) {
                        store.addDevice({
                            name: deviceName,
                            meta: { title: { en: deviceName }, driver: '' },
                            controls: {},
                        });
                    }
                    route.handler(topic, payload, deviceName, controlName);
                    break; // Прерываем цикл после первого совпадения
                }
            }
        });
    }

    function subscribeToTopics() {
        const topics = [
            '/devices/+/meta',
            '/devices/+/controls/+/meta',
            '/devices/+/meta/error',
            '/devices/+/controls/+/meta/error',
            '/devices/+/controls/+',
        ];
        topics.forEach((topic) => {
            client.value?.subscribe(topic, (err) => {
                if (err) console.error(`Subscription error for ${topic}:`, err);
            });
        });
    }

    function publishControl(deviceName: string, controlName: string, value: string | number) {
        client.value?.publish(`/devices/${deviceName}/controls/${controlName}/on`, String(value), { retain: false });
    }

    return { client, publishControl, init, connectionStatus, mqttBroker };
})

