import { useRef, useState } from "react";

function Story() {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const startDragging = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
      };
      const stopDragging = () => {
        setIsDragging(false);
      };
    
      const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Điều chỉnh tốc độ kéo
        scrollRef.current.scrollLeft = scrollLeft - walk;
      };
    return ( 
        <div 
        ref={scrollRef}
        onMouseDown={startDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onMouseMove}
        className="md:w-[940px] overflow-hidden ml-24 flex gap-6">
            {/* Add */}
            <div>
                <div className="flex items-center justify-center sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-1 border ">
                    <div className="flex items-center justify-center bg-slate-100 h-full w-full rounded-full">
                    <svg aria-label="Biểu tượng dấu cộng" class="x1lliihq x1n2onr6 x10xgr34" fill="currentColor" height="44" role="img" viewBox="0 0 24 24" width="44"><title>Biểu tượng dấu cộng</title><path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z"></path></svg>
                    </div>
                </div>
                <p className="text-center font-semibold">Mới</p>
            </div>
            
        </div>
     );
}

export default Story;