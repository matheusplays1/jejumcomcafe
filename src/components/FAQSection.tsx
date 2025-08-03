import { memo } from "react"

const FAQSection = memo(() => (
  <section className="py-20 bg-primary-dark">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-system">
        PERGUNTAS <span className="text-primary-orange font-extrabold">FREQUENTES</span>
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {[
          {
            question: "Jejum com café preto é seguro?",
            answer:
              "Sim, é um método natural usado há séculos. Sempre consulte um médico se tiver condições específicas.",
          },
          {
            question: "Posso tomar mais de uma xícara?",
            answer:
              "O protocolo recomenda 1 xícara em jejum. Mais pode ser consumido durante o dia conforme tolerância.",
          },
          {
            question: "Posso adaptar o protocolo?",
            answer: "Sim, o guia inclui adaptações para diferentes perfis e necessidades.",
          },
          {
            question: "Como acesso o material?",
            answer: "Imediatamente após a compra, você recebe o acesso por email.",
          },
          {
            question: "Tem grupo de suporte?",
            answer: "Sim, grupo exclusivo no WhatsApp para os primeiros 300 participantes.",
          },
          {
            question: "Funciona mesmo se eu não fizer dieta?",
            answer: "O protocolo é focado no jejum com café. Não requer dieta restritiva.",
          },
          {
            question: "Ajuda com dores de cabeça ou enxaqueca?",
            answer:
              "Muitas mulheres relataram redução ou desaparecimento das crises, principalmente ligadas ao jejum e ao café puro, que reduz inflamações. Resultados podem variar.",
          },
        ].map((item, index) => (
          <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
            <h3 className="text-xl font-bold text-primary-orange mb-3 font-system">{item.question}</h3>
            <p className="text-white text-lg font-medium font-system">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
))

export default FAQSection
