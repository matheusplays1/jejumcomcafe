"use client"

import { memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const OptimizedImage = memo(({ src, alt, className, ...props }: any) => (
  <img src={src || "/placeholder.svg"} alt={alt} className={className} loading="lazy" decoding="async" {...props} />
))

const ResultsSection = memo(
  ({
    beforeAfterImages,
    currentSlide,
    nextSlide,
    prevSlide,
    setCurrentSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }: any) => (
    <section className="py-20 bg-primary-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-system">
          RESULTADOS <span className="text-primary-orange font-extrabold">REAIS</span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <div
            className="overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {beforeAfterImages.map((item: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center shadow-2xl border border-orange-500/20">
                    <OptimizedImage
                      src={item.src || "/placeholder.svg"}
                      alt={item.alt}
                      className="w-full h-auto rounded-xl mb-4 shadow-lg max-h-96 object-cover"
                    />
                    <p className="text-primary-orange font-bold text-lg md:text-xl font-system">{item.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 md:p-3 rounded-full hover:bg-orange-500 transition-colors shadow-lg z-10 opacity-90 hover:opacity-100"
            aria-label="Resultado anterior"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 md:p-3 rounded-full hover:bg-orange-500 transition-colors shadow-lg z-10 opacity-90 hover:opacity-100"
            aria-label="Próximo resultado"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {beforeAfterImages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-orange-500" : "bg-gray-600"
                }`}
                aria-label={`Ir para resultado ${index + 1}`}
              />
            ))}
          </div>

          <p className="text-center text-primary-orange text-sm mt-4 md:hidden font-medium font-system">
            👆 Deslize para ver mais resultados
          </p>
        </div>
      </div>
    </section>
  ),
)

export default ResultsSection
