import { memo } from "react"
import { Star } from "lucide-react"

const OptimizedImage = memo(({ src, alt, className, ...props }: any) => (
  <img src={src || "/placeholder.svg"} alt={alt} className={className} loading="lazy" decoding="async" {...props} />
))

const TestimonialsSection = memo(({ testimonials }: any) => (
  <section className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-8 text-white font-system">
        TESTEMUNHOS DE <span className="text-primary-orange font-extrabold">FÉ E RESULTADO</span>
      </h2>

      <p className="text-xl text-center text-white mb-16 max-w-3xl mx-auto font-bold font-system">
        Mulheres comuns, com fé firme, que transformaram o corpo com um ato de obediência diária.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial: any, index: number) => (
          <div
            key={index}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300 border border-orange-500/20"
          >
            <OptimizedImage
              src={testimonial.image || "/placeholder.svg"}
              alt={`Depoimento ${index + 1}`}
              className="w-full h-auto rounded-xl mb-4 shadow-lg"
            />
            <div className="flex justify-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-primary-orange fill-current" />
              ))}
            </div>
            <p className="text-white text-lg leading-relaxed font-medium font-system">"{testimonial.text}"</p>
          </div>
        ))}
      </div>
    </div>
  </section>
))

export default TestimonialsSection
