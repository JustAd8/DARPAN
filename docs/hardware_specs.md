# Road Telemetry Hardware Specifications

Since you asked about hardware *other than* the ESP32 module, I have categorized the necessary components into **Sensors (Input)**, **Connectivity**, **Power**, and **Alternative Processors** depending on your performance needs.

## 1. Essential Sensors (The "Eyes & Ears")
To collect road telemetry, you need specific sensors to feed data to your processor.

| Component | Recommended Model | Purpose | Why this one? |
| :--- | :--- | :--- | :--- |
| **GPS / GNSS Module** | **NEO-M8N** or **NEO-6M** | Position, Speed, Altitude, Timestamp | The **M8N** is superior for road use; it supports 10Hz update rates (10 readings/sec), whereas the basic 6M is 1Hz. Accurate speed requires high refresh rates. |
| **IMU (Accelerometer + Gyro)** | **MPU-6050** or **BNO055** | Pothole detection, cornering G-force, road grade | **MPU-6050** is the standard low-cost choice. **BNO055** is more expensive but includes an onboard fusion algorithm for perfect orientation without complex math. |
| **OBD-II Interface** | **ELM327 (UART/Bluetooth)** | Engine RPM, Throttle Position, Fuel Level | Connects to the car's diagnostic port to get internal vehicle metrics. |
| **Magnetometer** (Optional) | **HMC5883L** | Compass Heading | Often built into 9-axis IMUs like MPU-9250. Helps determine vehicle direction when stationary. |

## 2. Power Supply (Crucial for Automotive)
Cars operate on 12V (or 24V for trucks), which will fry an ESP32 or Raspberry Pi (which need 5V/3.3V).

| Component | Model | Purpose |
| :--- | :--- | :--- |
| **Voltage Regulator (Buck Converter)** | **LM2596** or **MP1584** | Steps down Car Battery (12V) -> 5V safely. Efficient and generates less heat than linear regulators. |
| **Backup Battery** | **18650 Li-Ion Cell + TP4056** | Keeps the device running when the car simulates "ignition off" or during voltage cranks. |

## 3. Connectivity (Getting Data to Cloud)
If you want real-time tracking without using a phone hotspot.

| Component | Model | Purpose |
| :--- | :--- | :--- |
| **GSM/GPRS/LTE Module** | **SIM800L** (2G) or **SIM7600** (4G LTE) | Upload data directly to your server while driving. **SIM7600** is recommended as 2G is being phased out in many countries. |
| **SD Card Module** | **SPI MicroSD Adapter** | "Store and Forward". Saves data if network is lost and uploads later. |

## 4. Processing Alternatives (If not using ESP32)
If "other than ESP32" meant you want *alternative processors*:

- **Raspberry Pi Zero 2 W / Pi 4/5**:
    - *Use Case*: High-end telemetry, Video/Dashcam processing, AI pothole detection (Computer Vision), running a local database.
    - *Pros*: Runs Linux (Python/Node.js directly), USB support, HDMI output.
    - *Cons*: Higher power consumption, requires safe shutdown (corrupts SD card if power cut abruptly).

- **STM32 (Blue Pill / Black Pill)**:
    - *Use Case*: High-speed real-time raw data collection where ESP32 ADC/GPIO speed isn't enough (rare for basic telemetry).
    - *Pros*: More hardware interrupts, industrial reliability.
    - *Cons*: Much harder to program (C/C++), no built-in WiFi/Bluetooth (needs external module).

- **Arduino Portenta H7**:
    - *Use Case*: Industrial grade dual-core processing.
    - *Pros*: Extremely powerful, Python (MicroPython) support.
    - *Cons*: Very expensive.
