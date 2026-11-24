import { useState, useEffect } from "react";


export const AnimationText = ({items ,interval}) => {


  const [index, setIndex] = useState(0);   // 지금 보이는 문장
  const [prev, setPrev] = useState(null);  // 사라지는 중인 문장


  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => {
        setPrev(i);                        // 문장1  퇴장
        return (i + 1) % items.length;     // 문장2  등장, 끝이면 처음으로
      });
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval]);


return (
  <div className="rt">
    {prev !== null && (
      <span key={`out-${prev}`} className="rt-item rt-out" onAnimationEnd={() => setPrev(null)}>
        {items[prev]}
      </span>
    )}
    
  </div>
);
  
}
// 렌더: prev(위로 빠짐)와 index(아래서 올라옴)를 같은 칸에 겹쳐서 동시에 보여줌
// prev는 애니메이션이 끝나면 onAnimationEnd에서 null로 지움