import { useState } from "react"
export default function LessonCouponDropdowns({
  lessonCoupons,
  handleLessonSelector,
  handleLessonCUIDSelector,
}) {
  const coupons = lessonCoupons.map((v) => {
    return (
      <option key={v.id} value={v.discount} cuid={v.id}>
        {v.name}
      </option>
    )
  })


let select = ()=>{
 if(typeof localStorage !== 'undefined'){
  return localStorage.getItem('LessonCoupon')
 }else{
  return ''
 }
}

  return (
    <>
      <select
        id="lessonCoupons"
        className="form-select"
        aria-label="Default select example"
        defaultValue={'Default'}
        value={select()}
        onChange={(e) => {
          //目前抓不到
          console.log(e.target.getAttribute("cuid")); // 檢查是否能夠正確獲取到 data-cuid 的值
          let cuid = e.target.getAttribute("cuid");
          handleLessonSelector(e.target.value);
          handleLessonCUIDSelector(cuid);
          
        }}
      >
        <option value={'Default'} disabled>
          請選擇折價券
        </option>
        {coupons}
      </select>
    </>
  )
}
