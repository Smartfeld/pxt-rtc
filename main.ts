/**
* makecode echtzeituhr RTC Package.
* Based on DS1307 package from https://github.com/makecode-extensions/DS1307
*/

// enums to choose alarm number etc - these must be outside the namespace!
enum alarmNum {
    A1,
    A2
}

enum mode {
  Minute,
  HourMinute,
  DateHourMinute,
  DayHourMinute
}

enum interruptEnable {
  Aktivieren,
  Deaktivieren
}


/**
 * Echtzeituhr block
 */
//% weight=20 color=#b77ff0 icon="\uf017" block="echtzeituhr"
namespace echtzeituhr {
    let echtzeituhr_I2C_ADDR =     0x68
    let echtzeituhr_REG_SECOND =   0x00
    let echtzeituhr_REG_MINUTE =   0x01
    let echtzeituhr_REG_HOUR =     0x02
    let echtzeituhr_REG_DAY  =     0x03
    let echtzeituhr_REG_DATE =     0x04
    let echtzeituhr_REG_MONTH =    0x05
    let echtzeituhr_REG_YEAR =     0x06
    let echtzeituhr_REG_A1BASE =   0x08
    let echtzeituhr_REG_A2BASE =   0x0b
    let echtzeituhr_REG_CTRL =     0x0e
    let echtzeituhr_REG_STATUS  =  0x0f
    let echtzeituhr_REG_TEMPU  =   0x11
    let echtzeituhr_REG_TEMPL  =   0x12
    
    
    /**
     * set a echtzeituhr reg
     */
    function setReg(reg: number, dat: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(echtzeituhr_I2C_ADDR, buf);
    }

    /**
     * get a echtzeituhr reg value
     */
    function regValue(reg: number){
        pins.i2cWriteNumber(echtzeituhr_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(echtzeituhr_I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert Bcd to Dec
     */
    function bcdToDec(bcd: number){
        return (bcd >> 4) * 10 + (bcd % 16);
    }

    /**
     * convert Dec to Bcd
     */
    function decToBcd(dec: number){
        return Math.idiv(dec, 10) * 16 + (dec % 10)
    }


    /**
     * get Year
     */
    //% blockId="echtzeituhr_GET_YEAR" block="Jahr"
    //% weight=99 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function year(){
        return Math.min(bcdToDec(regValue(echtzeituhr_REG_YEAR)), 99) + 2000
    }

    /**
     * get Month
     */
    //% blockId="echtzeituhr_GET_MONTH" block="Monat"
    //% weight=98 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function month() {
        return Math.max(Math.min(bcdToDec(regValue(echtzeituhr_REG_MONTH)), 12), 1)
    }

    /**
     * get Date
     */
    //% blockId="echtzeituhr_GET_DATE" block="Tag"
    //% weight=97 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function date() {
        return Math.max(Math.min(bcdToDec(regValue(echtzeituhr_REG_DATE)), 31), 1)
    }


    /**
     * get (Week) Day
     */
    //% blockId="echtzeituhr_GET_DAY" block="Wochentag"
    //% weight=96 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function day(){
        return Math.max(Math.min(bcdToDec(regValue(echtzeituhr_REG_DAY)), 7), 1)
    }


    /**
     * get Hour
     */
    //% blockId="echtzeituhr_GET_HOUR" block="Stunde"
    //% weight=95 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function hour() {
        return Math.min(bcdToDec(regValue(echtzeituhr_REG_HOUR)), 23)
    }


    /**
     * get Minute
     */
    //% blockId="echtzeituhr_GET_MINUTE" block="Minute"
    //% weight=94 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function minute() {
        return Math.min(bcdToDec(regValue(echtzeituhr_REG_MINUTE)), 59)
    }


    /**
     * get Second
     */
    //% blockId="echtzeituhr_GET_SECOND" block="Sekunde"
    //% weight=93 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function second() {
        return Math.min(bcdToDec(regValue(echtzeituhr_REG_SECOND)), 59)
    }
    /**
     *  get status register
     */
    //% blockId="echtzeituhr_GET_STATUS" block="Status"
    //% weight=90 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function status() {
        return (regValue(echtzeituhr_REG_STATUS))
    }

    /**
     *  get control register
     */
    //% blockId="echtzeituhr_GET_CONTROL" block="Bedienung"
    //% weight=88 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function control(){
        return (regValue(echtzeituhr_REG_CTRL))
    }

    /**
     *  get temperature upper register
     */
    //% blockId="echtzeituhr_GET_TEMPU" block="Temperatur (obere)"
    //% weight=86 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function temperatureUpper() {
        return (regValue(echtzeituhr_REG_TEMPU))
    }

    /**
     *  get temperature lower register
     */
    //% blockId="echtzeituhr_GET_TEMPL" block="Temperatur (untere)"
    //% weight=84 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function temperatureLower(){
        return (regValue(echtzeituhr_REG_TEMPL))
    }

    /**
     * set Date and Time
     * @param year is the Jahr  to be set, eg: 2020
     * @param month is the Monat  to be set, eg: 2
     * @param date is the Tag  to be set, eg: 15
     * @param day is the Wochentag (of the week) to be set, eg: 4
     * @param hour is the Stunde  to be set, eg: 0
     * @param minute is the Minute to be set, eg: 0
     * @param second is the Sekunde to be set, eg: 0
     */
    //% blockId="echtzeituhr_SET_DATETIME" block="set Jahr %year|Monat %month|Tag %date|Wochentag %day|Stunde %hour|Minute %minute|Sekunde %second"
    //% year.min=2000 year.max=2099
    //% month.min=1   month.max=12
    //% date.min=1    date.max=31
    //% day.min=1     day.max=7
    //% hour.min=0    hour.max=23
    //% minute.min=0  minute.max=59
    //% second.min=0  second.max=59
    //% weight=60 blockGap
    //% parts=echtzeituhr trackArgs=0
    export function dateTime(year: number, month: number, date: number, day: number, hour: number, minute: number, second: number){
        let buf = pins.createBuffer(8);
        buf[0] = echtzeituhr_REG_SECOND;
        buf[1] = decToBcd(second);
        buf[2] = decToBcd(minute);
        buf[3] = decToBcd(hour);
        buf[4] = decToBcd(day);
        buf[5] = decToBcd(date);
        buf[6] = decToBcd(month);
        buf[7] = decToBcd(year-2000);//bug fix, notified by pull req from mworkfun
        pins.i2cWriteBuffer(echtzeituhr_I2C_ADDR, buf)
    }
    
    
    /**
     * set Alarm mode and time registers for alarm An (n = 1 or 2)
     * @param modeAn is the matching Modus for An eg:hour minute
     * @param interruptAn is the interrup enable for An eg: on
     * @param name is the Alarm name (A1 or A2)
     * @param date is the Tag  to be set, eg: 15
     * @param day is the Wochentag (of the week)  to be set, eg: 4
     * @param hour is the Stunde  to be set, eg: 13
     * @param minute is the Minute to be set, eg: 0
     */
    //% blockId="echtzeituhr_ALARM" block="set Alarm %name| Modus %modeAn| Wochentag %date|Tag %day|Stunde %hour|Minute %minute"
    //% date.min=1    date.max=31
    //% day.min=1     day.max=7
    //% hour.min=0    hour.max=23
    //% minute.min=0  minute.max=59
    //% weight=58 blockGap
    //% parts=echtzeituhr trackArgs=0
    export function setAlarm(name: alarmNum, modeAn: mode, date: number, day: number, hour: number, minute: number) {
        let buf = pins.createBuffer(4)
        buf[1] = decToBcd(minute)  //raw minutes, before AnM2 is set
        buf[2] = decToBcd(hour)    //raw hours before AnM3 is set
        buf[3] = decToBcd(date)
        switch(name) {
            case alarmNum.A1: buf[0] = echtzeituhr_REG_A1BASE
                break
            case alarmNum.A2: buf[0] = echtzeituhr_REG_A2BASE
        }
        
        switch(modeAn){
            case mode.Minute: {
                buf[3] = buf[3] | 0x80 //set AnM4
                buf[2] = buf[2] | 0x80 //set AnM3
                break
            }
            case mode.HourMinute: {
                buf[3] = buf[3] | 0x80 //set AnM4
                break
            }
            case mode.DateHourMinute: {
                buf[3] = decToBcd(date)
                break
            }
            case mode.DayHourMinute: {
              buf[3] = decToBcd(day)
              buf[3] = buf[3] | 0x40 //set DY bit
            }
        }
        pins.i2cWriteBuffer(echtzeituhr_I2C_ADDR, buf)

    }

/**
     * alarm interrupt enable An (1 or 2)
     * @param name is the Alarm name (A1 or A2)
     * @param mode is Enable or Disable
     */
    //% blockId="echtzeituhr_ALARM_INTERRUPT_ENABLE" block="Alarmunterbrechung aktivieren  %name |%mode"
    //% weight=56 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function disableAlarm(name: alarmNum, mode: interruptEnable){
        let control = regValue(echtzeituhr_REG_CTRL)
        switch(name) {
            case alarmNum.A1:
                switch(mode){
                    case interruptEnable.Aktivieren: setReg(echtzeituhr_REG_CTRL, control | 0x01)
                    break
                    case interruptEnable.Deaktivieren: setReg(echtzeituhr_REG_CTRL, control & 0xfe)
                }
                break
            case alarmNum.A2: setReg(echtzeituhr_REG_CTRL, control & 0xfd)
                switch(mode) {
                    case interruptEnable.Aktivieren: setReg(echtzeituhr_REG_CTRL, control | 0x02)
                    break
                    case interruptEnable.Deaktivieren: setReg(echtzeituhr_REG_CTRL, control & 0xfd)
                }
        }
    }

    /**
     * clear alarm flag An (n = 1 or 2)
     * @param name is the Alarm name (A1 or A2)
     */
    //% blockId="echtzeituhr_CLEAR_ALARM_FLAG" block="Alarmflagge löschen %name"
    //% weight=52 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function clearAlarmFlag(name: alarmNum){
        let reg = regValue(echtzeituhr_REG_STATUS)
        switch(name) {
            case alarmNum.A1: setReg(echtzeituhr_REG_STATUS, reg & 0xfe)
                break
            case alarmNum.A2: setReg(echtzeituhr_REG_STATUS, reg & 0xfd)
        }
    }

    /**
     * configure INTCN
     * @param name is the Alarm name (A1 or A2)
     */
    //% blockId="echtzeituhr_CONFIG_INTCN" block="konfiguriere INTCN %mode"
    //% weight=50 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function configureINTCN(mode: interruptEnable){
        let control = regValue(echtzeituhr_REG_CTRL)
        switch(mode){
            case interruptEnable.Aktivieren:  control = control | 0x04 //set b2
            break
            case interruptEnable.Deaktivieren: control = control & 0xfb //reset b2
        }
        setReg(echtzeituhr_REG_CTRL, control)
    }

    /**
     * read any register - for DEBUG only
     */
    //% blockId="echtzeituhr_GET_ANYREG" block="Register lesen %reg"
    //% weight=48 blockGap=8
    //% parts=echtzeituhr trackArgs=0
    export function readReg(reg: number) {
        return (regValue(reg))
    }
}
//
