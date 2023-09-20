/**
 * sql的错误
 */
const sqlErrorCode = [
  'ER_DUP_ENTRY'
]




// 查询全部
const selectAll = (table) => `select * from ${table}`

/**
 * 条件查询
 * @param {*} table 
 * @param {Array} cont 条件
 * @param {string} connect 连接条件
 * @returns 
 */
const selectContions = (table, cont, connect = ' and ') => {
  const condition = cont.map(item => {
    return item + '=?'
  }).join(connect)
  return `select * from ${table} where ${condition}`
}

/**
 *  查询指定数据
 * @param {*} table 
 * @param {Array} onceValue 指定查询数据
 * @param {Array} cont 条件
 * @param {string} connect 连接条件
 * @returns 
 */
const selectOnceContions = (table, onceValue, cont, connect = ' and ') => {
  const condition = cont.map(item => {
    return item + '=?'
  }).join(connect)
  return `select ${onceValue.toString()} from ${table} where ${condition}`
}

/**
 * 查询数量
 * @param {*} table 
 * @param {Array[]} condition  条件
 * @returns 
 */
const selectCount = (table, condition) => {
  condition = condition.map(item => {
    return `${item}=?`
  })
  return `select count(*) AS nums from ${table} where ${condition}`
}

/**
 * 
 * @param {Array} table 
 * @param {Array} onceValue 指定查询数据 
 * @param {string} join 连接方式 
 * @param {string} condition 条件 
 */
const selectJoin = (table, onceValue, join, condition) => {
  onceValue = onceValue.length === 0 ? '*' : onceValue.toString()
  return `SELECT ${onceValue} from ${table[0]} a ${join} join ${table[1]} b on ${condition}`
}

/**
 * 修改
 * @param {*} table 表名
 * @param {Array} value 更新名称
 * @param {String} condition 条件 
 * @returns 
 */
const update = (table, value, condition) => {
  const setValue = value.map(item => {
    return item + '=?'
  })
  const condt = condition.map(item => {
    return item + '=?'
  })
  return `update ${table} set ${setValue.toString()} where ${condt.toString()}`
}

/**
 * 添加
 * @param {*} table 表名
 * @param {*} nums 添加数量
 * @returns 
 */
const insertAll = (table, nums) => {
  const values = Array.from({ length: nums }).fill('?')
  return `INSERT INTO ${table} VALUES(${values.toString()})`
}

/**
 * 按需添加
 * @param {*} table 表名
 * @param {Array} valueOnce 添加的名称
 * @returns 
 */
const insetOnce = (table, valueOnce) => {
  const values = Array.from({ length: valueOnce.length }).fill('?')
  return `INSERT INTO ${table} (${valueOnce.toString()}) VALUES(${values.toString()})`
}

/**
 * 按需-条件添加
 * @param {*} table 
 * @param {*} valueOnce 添加名称
 * @param {*} condition 条件
 * @returns 
 */
const insetContions = (table, valueOnce, condition) => {
  const values = Array.from({ length: valueOnce.length }).fill('?')
  return `INSERT INTO ${table} (${valueOnce.toString()}) VALUES(${values.toString()}) where ${condition}`
}

module.exports = {
  selectAll,
  update,
  insertAll,
  insetOnce,
  selectContions,
  selectOnceContions,
  insetContions,
  selectCount,
  selectJoin,
  sqlErrorCode
}