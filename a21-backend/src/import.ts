import * as fs from "fs"
import {indicesOf} from "./includes"
import {ITask} from "./types"

let tasks = <ITask[]>[
    {
        rawFilename: 'A21all00.TXT',
        columnArr: ['FREQ', 'STRT', 'STOP', 'ZONES', 'LOC', 'POWR', 'AZIMUTH', 'SLW',
            'ANT', 'DAYS', 'FDATE', 'TDATE', 'MOD', 'AFRQ', 'LANGUAGE', 'ADM', 'BRC', 'FMO',
            'REQ', 'OLD', 'ALT1', 'ALT2', 'ALT3', 'NOTES'],
        dumpFilename: 'a21.json'
    },
    {
        rawFilename: 'site.txt',
        columnArr: ['Code', 'Site', 'ADM', 'Latitude', 'Longitude'],
        dumpFilename: 'site.json'
    },
    {
        rawFilename: 'broadcas.txt',
        columnArr: ['CODE', 'BROADCASTER'],
        dumpFilename: 'broadcaster.json',
        lineBreakChar: ' '
    },
    {
        rawFilename: 'admin.txt',
        columnArr: ['CODE', 'EN_NAME', 'FR_NAME', 'SP_NAME'],
        dumpFilename: 'admin.json',
        lineBreakChar: ' '
    }
]
for (let task of tasks) {
    let dataContent = fs.readFileSync(__dirname + '/../res/' + task.rawFilename, 'utf-8')
    let dataLines = dataContent.replace(/\r/g, '').split('\n')
        .map(value => value.trim()).filter(value => value.length != 0)
    let noteLines: string[] = []
    let radioLines: string[] = []
    for (let line of dataLines) {
        if (line.startsWith(';')) {
            noteLines.push(line)
        } else {
            radioLines.push(line)
        }
    }
    let lineBreakPositions: number[] = indicesOf((task.lineBreakChar === undefined) ? '+' : task.lineBreakChar, noteLines[noteLines.length - 1])
    lineBreakPositions.push(noteLines[noteLines.length - 1].length)
    let columnArr = task.columnArr
    let radioArr = []
    for (let line of radioLines) {
        let lineArr: string[] = []
        let lastPos = 0
        for (let [index, pos] of lineBreakPositions.entries()) {
            lineArr.push(line.substring(lastPos, pos).trim())
            lastPos = pos
        }
        radioArr.push(lineArr)
    }
    let arr = []
    for (let radio of radioArr) {
        let single: any = {}
        for (let [index, column] of columnArr.entries()) {
            single[column] = radio[index]
        }
        arr.push(single)
    }
    fs.writeFileSync(__dirname + '/../dump/' + task.dumpFilename, JSON.stringify(arr, null, 2))
}
