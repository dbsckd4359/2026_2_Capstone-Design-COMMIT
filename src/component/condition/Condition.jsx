
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useIndustries } from "../../hock/useIndustries"
import { useFlow } from "../../store/useFlow"
import '../../App.css'
import searchlogo from "/src/assets/default-icon/search.svg";
import closelogo from "/src/assets/default-icon/close.svg";




const SIZES = ['소형', '중형', '대형'];
const AGES = ['10대', '20대', '30대', '40대', '50대+'];

export const Condition = ({ onClose, open }) => {
    const navigate = useNavigate();
    const { industries, loading, error } = useIndustries();



    const location = useFlow((s) => s.location);
    const industry = useFlow((s) => s.industry);
    const subIndustry = useFlow((s) => s.subIndustry);
    const setIndustry = useFlow((s) => s.setIndustry);
    const setSubIndustry = useFlow((s) => s.setSubIndustry);
     console.log(setSubIndustry);

    const [accordionOpen, setAccordionOpen] = useState(false);
    const closeRef = useRef(null);

    /*백엔드 요청에 의한 응답 형태 오류(/categories응답이 industries로 바뀌지 않음) */ 
  const subs = industries.find((i) => i.code === industry?.code)?.subs ?? [];
//const subs = (industries ?? [] ).find(i => i.code === industries.code);  
console.log(subs);

//남아있는 세부 업종이 지금 업종 소속이 아닐 경우를 대비한 교정 코드
useEffect(() => {
    if (!industry || subs.length === 0) return;
    if (!subs.some((s) => s.code === subIndustry?.code)) {
        setSubIndustry({ code: subs[0].code, name: subs[0].name });
    }
}, [industry, subs, subIndustry, setSubIndustry]);



    const canSubmit = Boolean(industry && subIndustry);


    // 팝업이 열리면 닫기 버튼에 포커스, Esc로 닫기
    useEffect(() => {
        if (!open) return;
        closeRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const handleIndustry = (item) => {
        console.log(item);
        setIndustry({ code: item.code, name: item.name }); // 업종이 바뀌면 세부 업종 초기화
        setSubIndustry(item.subs[0]);//세부 업종 자동 선택
       console.log(item.subs[0]);
        setAccordionOpen(true);                             // 세부 업종 바로 펼치기
    };

    //상세 분석 페이지 전환
    const handleSubmit = () => {
        if (!canSubmit) return;
        onClose?.();
        navigate('/pages/TopPage.jsx');
    };

    return (
        <div className={`condition-overlay ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="condition-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div className="condition-space">
                <div className="condition-left">
                    <span className="condition-left-sub-title01">•희망 업종</span>
                    <div className="lavel1-layer">
                        {loading && <span>업종 불러오는 중…</span>}
                        {error && <span className="error">{error}</span>}
                        {industries.map((item) => (
                            <label key={item.code}>
                                <input type="radio" name="industry" value={item.code}
                                    checked={industry?.code === item.code}
                                    onChange={() => handleIndustry(item)} />
                                <span>{item.name}</span>
                            </label>
                        ))}
                    </div>
                    <span className="condition-left-sub-title02">•세부 업종</span>
                    <div className="accordion-item">

                        <button className="accordion-title" type="button"
                            aria-expanded={accordionOpen} aria-controls="sub-industry-list"
                            disabled={!industry}
                            onClick={() => setAccordionOpen((v) => !v)}>
                            <span id="servies-text">{subIndustry?.name ?? (industry ? '업종을 선택하세요' : '희망 업종을 먼저 선택하세요')}</span>
                            <span className="icon">{accordionOpen ? '▲' : '▼'}</span>
                        </button>
                        {accordionOpen && (
                            <div className="accordion-content" id="sub-industry-list">
                                <div className="header"><img src={searchlogo} alt="COMMIT 홈" height="20" /><input type="text" placeholder="세부 업종 입력" />
                                    <button> <img src= {closelogo} alt="COMMIT 홈" height="20" /></button></div>
                                <div className="category">
                                    <span id="category-title">구분</span>
                                        {industries.map((item) =>  {
                                         const isSelect = industry.code === item.code;
                                 return(                                    
                                <span key={item.code}  className={`category-list ${isSelect ?'is-select' : ''} `}>{item.name}</span>
       
                                     )})}
                                </div>


                                <div className="content">
                                    <span id="content-title"> {industry ? `${industry.name}`: ''}•세부 업종</span>
                                <div className="content-list">
                                    {subs.map((sub) => (
                                        <>
                                            <label key={sub.code} >
                                                <input type="radio" name="sub-industry" value={sub.code}
                                                    checked={subIndustry?.code === sub.code}
                                                    onChange={() => { setSubIndustry({ code: sub.code, name: sub.name }); setAccordionOpen(false); }} />
                                                <span style={{fontSize:"0.6rem"}}>{sub.name}</span>
                                            </label>
                                            <br />
                                  
                                       </> 
                                    ))}
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 규모·고객층: 데이터 가공 여부 미정 (비활성화) */}
                    <span className="condition-left-sub-title03">•업종 규모 (준비 중)</span>
                    <div className="stores-layer" aria-disabled="true">
                        {SIZES.map((s) => (
                            <label key={s}><input type="checkbox" disabled /><span>{s}</span>
                                <p>업장 기준</p></label>
                        ))}
                    </div>

                    <span className="condition-left-sub-title04">•주요 고객층(선택) (준비 중)</span>
                    <div className="cusumer-layer" aria-disabled="true">
                        {AGES.map((a) => (
                            <label key={a}><input type="checkbox" disabled /><span>{a}</span></label>
                        ))}
                    </div>

                    <div className="end-space">

                        <p>필수입력:희망 업종•세부 업종 선택입력:업종규모•주요 고객층(준비 중)</p>
                    </div>
                </div>

                <div className="condition-right">
                    <button ref={closeRef} type="button" className="condition-close" aria-label="조건 설정 닫기" onClick={onClose}>X</button>
                    <span id="condition-title">선택요약</span>
                    <div class="curr-right-space">
                        <span >선택위치</span>
                        <p> {location?.name ?? '지도에서 선택하지 않음'}</p>
                        <span>업종</span>
                        <p> {industry ? `${industry.name} › ${subIndustry?.name ?? '세부 업종 미선택'}` : '미선택'}</p>
                        <span>규모</span>
                        <p > 준비 중</p>
                        <span>고객층</span>
                        <p>준비 중</p>
                    </div>
                    <div class="analisis-space">
                    <p> 춘천시 전체 행정동을 같은 기준으로 비교합니다.</p>
                    </div>

                    <button class="diff-btn" type="button" disabled={!canSubmit} onClick={handleSubmit}>상권 비교하기</button>
                    {!canSubmit && <p style={{ fontWeight: "bold" }}>희망 업종과 세부 업종을 선택하세요</p>}

                </div>
            </div>
        </div>
    )
}
