//    helper
function dayFormat(day) {
    switch(day) {
        case 'Mon':
            return '星期一';
        case 'Tue':
            return '星期二';
        case 'Wed':
            return '星期三';
        case 'Thu':
            return '星期四';
        case 'Fri':
            return '星期五';
        case 'Sat':
            return '星期六';
    }
}

function daySimpleFormat(day) {
    switch(day) {
        case 'Mon':
            return '一';
        case 'Tue':
            return '二';
        case 'Wed':
            return '三';
        case 'Thu':
            return '四';
        case 'Fri':
            return '五';
        case 'Sat':
            return '六';
    }
}

function periodFormat(period) {
    switch(period) {
        case '08300900':
            return '08:30 - 09:00 (上午八點半到九點)';
        case '09000930':
            return '09:00 - 09:30 (上午九點到九點半)';
        case '09301000':
            return '09:30 - 10:00 (上午九點半到十點)';
        case '10001030':
            return '10:00 - 10:30 (上午十點到十點半)';
        case '10301100':
            return '10:30 - 11:00 (上午十點半到十一點)';
        case '11001130':
            return '11:00 - 11:30 (上午十一點到十一點半)';
        case '13301400':
            return '13:30 - 14:00 (下午一點半到兩點)';
        case '14001430':
            return '14:00 - 14:30 (下午兩點到兩點半)';
        case '14301500':
            return '14:30 - 15:00 (下午兩點半到三點)';
        case '15001530':
            return '15:00 - 15:30 (下午三點到三點半)';
        case '15301600':
            return '15:30 - 16:00 (下午三點半到四點)';
        case '16001630':
            return '16:00 - 16:30 (下午四點到四點半)';
        case '17301800':
            return '17:30 - 18:00 (晚上五點半到六點)';
        case '18001830':
            return '18:00 - 18:30 (晚上六點到六點半)';
        case '18301900':
            return '18:30 - 19:00 (晚上六點半到七點)';
        case '19001930':
            return '19:00 - 19:30 (晚上七點到七點半)';
        case '19302000':
            return '19:30 - 20:00 (晚上七點半到八點)';
        case '20002030':
            return '20:00 - 20:30 (晚上八點到八點半)';
        case '20302100':
            return '20:30 - 21:00 (晚上八點半到九點)';
    }
}