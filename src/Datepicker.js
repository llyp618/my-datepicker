// style
import './main.less'

let Datepicker = {}

Datepicker.monthData = null
Datepicker.$wrapper = null

/**
 * 生成当月日期 返回一个长度为 7 * 6的数组
 * 原理就是获取当月第一天并取得其是星期几，然后确定当月第一天在首行日期表位置，再确定上个月在这张表中显示的日期有几天
 * 再确定下一个月在当前表中的有几天。
 * 
 * @param {number} year 年份
 * @param {number} month 月份 无须减去1
 * 
 * @return {array}
 */
Datepicker.getMonthData = function(year, month) {
  let ret = []
  // 获取当月的第一天信息
  let firstDay = new Date(year, month - 1, 1)
  let firstDayWeekDay = firstDay.getDay()
  if (firstDayWeekDay === 0) firstDayWeekDay = 7

  // 获取年月
  year = firstDay.getFullYear()
  month = firstDay.getMonth() + 1

  // 获取上个月最后一天信息
  let lastDayOfLastMonth = new Date(year, month - 1, 0)
  // 获取上一个月最后一天日期 是 30 还是 31 还是 28 或 29
  let lastDateofLastMonth = lastDayOfLastMonth.getDate()

  // 日期第一行显示上一个月的日期数
  let preMonthDayCount = firstDayWeekDay - 1

  // 获取当月最后一天信息
  let lastDay = new Date(year, month, 0)
  let lastDate = lastDay.getDate()
  
  for(let i = 0; i < 7*6; i++){
    let date = i - preMonthDayCount + 1
    let showDate = date
    let thisMonth = month
    // 上一月
    if(date <= 0) {
      thisMonth = month - 1
      showDate = lastDateofLastMonth + date
    }else if (date > lastDate){
      thisMonth = month + 1
      showDate = date - lastDate
    }
    if (thisMonth === 0) thisMonth = 12
    if (thisMonth === 13) thisMonth = 1

    ret.push({
      month: thisMonth,
      date: date,
      showDate: showDate
    })
  }
  return {
    year: year,
    month: month,
    ret: ret
  }
}
/**
 * 渲染数据
 * @param {number} year 
 * @param {number} month 
 * @return {string} 
 */
Datepicker.buildUi = function(year, month){
  if(!year || !(month+1)){
    let today = new Date()
    year = today.getFullYear()
    // new Date 获取月份 默认减1 这里加回去
    month = today.getMonth() + 1
  }
  let monthData = Datepicker.getMonthData(year, month)
  // 存起来
  Datepicker.monthData = monthData
  let ret = monthData.ret
  let monthBody = ''
  for ( let i = 0; i < ret.length ; i++){
    let date = ret[i]
    if(i%7 === 0){
      monthBody += `<tr>`
    }
    if( date.month != (month % 12 || 12) ){
      monthBody += `<td class="ui-dp-gray-date">${date.showDate}</td>`
    }else {
      monthBody += `<td>${date.showDate}</td>`
    }
    if(i%7 === 6){
      monthBody += `</tr>`
    }
  }
  let dom = 
    `<div class="ui-dp-header">
        <a href="javascript:;" class="ui-dp-btn ui-dp-btn-prev">&lt;</a>
        <a href="javascript:;" class="ui-dp-btn ui-dp-btn-next">&gt;</a>
        <span class="ui-dp-curr-month">${monthData.year}-${monthData.month}</span>
      </div>
      <div class="ui-dp-body">
        <table>
          <thead>
              <tr>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th>六</th>
                <th>日</th>
              </tr>
          </thead>
          <tbody>
            ${monthBody}
          </tbody>
        </table>
      </div>`
  return dom
}
/**
 * 打开
 * @param {object}  $input
 * @param {object}  $wrapper
 */
Datepicker.open = function($input, $wrapper){
  let top = $input.offsetTop + $input.offsetHeight + 2
  let left = $input.offsetLeft
  $wrapper.style['top'] = top + 'px'
  $wrapper.style['left'] = left + 'px'
  $wrapper.classList.add('active')
}
/**
 * 关闭
 * @param {object} $wrapper  
 */
Datepicker.close = function($wrapper) {
  $wrapper.classList.remove('active')
}

/**
 * 渲染
 * @param {string} dir 
 * @return {object} 
 */
Datepicker.render = function(dir) {
  let year, month
  if (Datepicker.monthData) {
    year = Datepicker.monthData.year
    month = Datepicker.monthData.month
  }
  if(dir === 'prev') month--
  if(dir === 'next') month++
  let dom = Datepicker.buildUi(year, month)
  if(!Datepicker.$wrapper){
    Datepicker.$wrapper = document.createElement('div')
    Datepicker.$wrapper.className = 'ui-dp-wrapper'
    document.body.appendChild(Datepicker.$wrapper)
  }
  Datepicker.$wrapper.innerHTML = dom
  return Datepicker.$wrapper
}

/**
 * 初始化
 * @param {object} $input
 */
Datepicker.init = function($input){
  if(Object.prototype.toString.call($input) !== '[object HTMLInputElement]') {
    console.error('the HTMLInputElement is necessary!!')
  }
  // 渲染dom
  let $wrapper = Datepicker.render()
  
  // 开关
  let isOpen = false
  $input.addEventListener('click', function(e){
    e.stopPropagation()
    if(isOpen){
      return false
    }
    Datepicker.open($input, $wrapper)
    isOpen = true
  }, false)


  $wrapper.addEventListener('click', function(e){
    e.stopPropagation()
    let target = e.target
    let targetClassList = target.classList
    if(!targetClassList.contains('ui-dp-btn')){
      return
    }
    if(targetClassList.contains('ui-dp-btn-prev')) {
      Datepicker.render('prev')
    }else if(targetClassList.contains('ui-dp-btn-next')) {
      Datepicker.render('next')
    }
  }, false)


  document.addEventListener('click', function(e){
    if(isOpen){
      Datepicker.close($wrapper)
      isOpen = false
    }
  }, false)
}
export default Datepicker



