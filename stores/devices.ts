// stores/devices.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {throttle} from 'lodash-es'

export interface Control {
    name: string;
    type: 'switch' | 'range' | 'value' | 'text' | string;
    value: string | number;
    meta: {
        title?: { en: string; ru?: string };
        min?: number;
        max?: number;
        units?: string;
        readonly?: boolean;
        precision?: number;
    };
    error?: string;
}

export interface Device {
    name: string;
    meta: {
        title: { en: string; ru?: string };
        driver: string;
    };
    controls: Record<string, Control>;
    error?: string;
}

export const useDevicesStore = defineStore('devices', () => {
    const devices = ref<Record<string, Device>>({});
    const throttledUpdates = new Map<string, (value: string | number) => void>();

    function addDevice(device: Device) {
        devices.value[device.name] = device;
    }

    function updateControl(deviceName: string, controlName: string, value: string | number) {
        const key = `${deviceName}/${controlName}`;

        // Если троттлированная функция для этого контролла ещё не создана, создаём её
        if (!throttledUpdates.has(key)) {
            const updateFn = throttle((val: string | number) => {
                if (devices.value[deviceName]?.controls[controlName]) {
                    devices.value[deviceName].controls[controlName].value = val;
                }
            }, 100); // Троттлинг на 100 мс
            throttledUpdates.set(key, updateFn);
        }

        // Вызываем троттлированную функцию
        const throttledFn = throttledUpdates.get(key)!;
        throttledFn(value);
    }

    function setDeviceError(deviceName: string, error: string | null) {
        if (devices.value[deviceName]) {
            devices.value[deviceName].error = error || undefined;
        }
    }

    function setControlError(deviceName: string, controlName: string, error: string | null) {
        if (devices.value[deviceName]?.controls[controlName]) {
            devices.value[deviceName].controls[controlName].error = error || undefined;
        }
    }

    // Добавляем метод удаления устройства
    function removeDevice(deviceName: string) {
        if (devices.value[deviceName]) {
            delete devices.value[deviceName];
        }
    }

    // Добавляем метод удаления контролла
    function removeControl(deviceName: string, controlName: string) {
        if (devices.value[deviceName]?.controls[controlName]) {
            Object.keys(devices.value[deviceName].controls).forEach(controlName => {
                throttledUpdates.delete(`${deviceName}/${controlName}`);
            });
            delete devices.value[deviceName].controls[controlName];
        }
    }

    return { devices, addDevice, updateControl, setDeviceError, setControlError, removeDevice, removeControl };
});