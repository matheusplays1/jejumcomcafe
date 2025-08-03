"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from "react"
import {
  Star,
  Shield,
  Gift,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  X,
  Brain,
  Zap,
  Heart,
  MessageCircle,
} from "lucide-react"

// Lazy load components that are not immediately visible
const LazyResultsSection = lazy(() => import("./components/ResultsSection"))
const LazyTestimonialsSection = lazy(() => import("./components/TestimonialsSection"))
const LazyFAQSection = lazy(() => import("./components/FAQSection"))

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (callback: () => void, options = {}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(ref)
        }
      },
      { threshold: 0.1, ...options },
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, callback])

  return setRef
}

// Optimized Image component with lazy loading and WebP support
const OptimizedImage = memo(
  ({
    src,
    alt,
    className,
    priority = false,
    ...props
  }: {
    src: string
    alt: string
    className?: string
    priority?: boolean
    [key: string]: any
  }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [imageSrc, setImageSrc] = useState(priority ? src : "")

    const loadImage = useCallback(() => {
      if (!imageSrc && src) {
        setImageSrc(src)
      }
    }, [src, imageSrc])

    const ref = useIntersectionObserver(loadImage, { threshold: 0.1 })

    return (
      <div ref={priority ? null : ref} className={`${className} ${!isLoaded ? "bg-gray-900 animate-pulse" : ""}`}>
        {imageSrc && (
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            className={className}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            {...props}
          />
        )}
      </div>
    )
  },
)

// Memoized Notification Card
const NotificationCard = memo(({ notification, showNotification, onClose }: any) => (
  <div
    className={`fixed top-3 left-3 md:top-6 md:left-6 z-40 transition-all duration-500 ${
      showNotification ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
    }`}
  >
    <div className="bg-gradient-to-r from-orange-900/95 to-orange-800/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 shadow-2xl border border-orange-500/20 max-w-xs md:max-w-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-orange-400/10 rounded-2xl blur-xl -z-10"></div>
      <div className="flex items-start space-x-2 md:space-x-3">
        <div className="flex-shrink-0 w-6 h-6 md:w-10 md:h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xs md:text-lg">✝️</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 md:space-x-2 mb-1">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-xs text-orange-200 font-semibold uppercase tracking-wide">Agora</span>
          </div>
          <p className="text-white font-bold text-xs md:text-sm leading-tight mb-1">
            <span className="text-orange-300 font-extrabold">{notification.name}</span> {notification.action}
          </p>
          <p className="text-orange-100/80 text-xs md:text-xs leading-relaxed italic hidden md:block font-medium">
            "{notification.subtitle}"
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-orange-300 hover:text-white transition-colors p-0.5 md:p-1"
          aria-label="Fechar notificação"
        >
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
))

// Memoized Floating Button
const FloatingButton = memo(({ onClick }: { onClick: () => void }) => (
  <div className="fixed bottom-24 right-4 left-4 md:bottom-6 md:right-6 md:left-auto z-[45] flex justify-center md:justify-end">
    <button
      onClick={onClick}
      className="w-full md:w-auto bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3.5 px-6 rounded-full shadow-lg hover:from-orange-500 hover:to-orange-400 hover:font-extrabold transition-all duration-300 transform hover:scale-105"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
      aria-label="Entrar no Propósito Agora"
    >
      <div className="text-center">
        <div className="text-sm font-bold">Entrar no Propósito Agora</div>
        <div className="text-xs opacity-90 mt-1 font-medium">Clique aqui e inicie o Jejum com Café Preto</div>
      </div>
    </button>
  </div>
))

// Memoized Cookie Banner
const CookieBanner = memo(({ showCookieBanner, onAccept, onClose }: any) => {
  if (!showCookieBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-orange-500/30 p-4 shadow-2xl">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center md:text-left">
          <p className="text-white text-sm md:text-base font-medium">
            Este site utiliza cookies para garantir que você tenha a melhor experiência. Ao continuar, você aceita o uso
            de cookies conforme nossa Política de Privacidade.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAccept}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-full transition-colors duration-300"
          >
            Aceitar
          </button>
          <button
            onClick={onClose}
            className="text-orange-400 hover:text-white transition-colors duration-300 p-1"
            aria-label="Fechar banner de cookies"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
})

// Memoized Hero Video Component
const HeroVideo = memo(() => (
  <div className="w-full max-w-3xl mx-auto">
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
      <script src="https://fast.wistia.com/player.js" async defer></script>
      <script src="https://fast.wistia.com/embed/gc9ywrd50y.js" async defer type="module"></script>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            wistia-player[media-id='gc9ywrd50y']:not(:defined) { 
              background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/gc9ywrd50y/swatch'); 
              display: block; 
              filter: blur(5px); 
              padding-top:100.0%; 
            }
          `,
        }}
      />
      <wistia-player media-id="gc9ywrd50y" aspect="1.0"></wistia-player>
    </div>
  </div>
))

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)
  const [showNotification, setShowNotification] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showCookieBanner, setShowCookieBanner] = useState(false)

  // Memoized data to prevent unnecessary re-renders
  const notifications = useMemo(
    () => [
      {
        name: "Maria - SP",
        action: "acaba de iniciar o Jejum com Café Preto.",
        subtitle: "Transformação em corpo e alma começando agora.",
      },
      {
        name: "Juliana - RJ",
        action: "fez sua inscrição no propósito das 7h.",
        subtitle: "1 xícara. 1 oração. Um novo começo.",
      },
      {
        name: "Patrícia - MG",
        action: "garantiu acesso ao método sagrado.",
        subtitle: "Escolheu emagrecer com fé e direção divina.",
      },
      {
        name: "Ana - DF",
        action: "entrou no protocolo espiritual agora mesmo.",
        subtitle: "Decidiu cuidar do corpo com a Palavra como guia.",
      },
      {
        name: "Fernanda - BA",
        action: "começou o propósito de 14 dias.",
        subtitle: "Café, Bíblia e foco... O milagre começa por dentro.",
      },
      {
        name: "Simone - SC",
        action: "acaba de acessar o guia completo.",
        subtitle: "+1 mulher quebrando ciclos de ansiedade com fé.",
      },
      {
        name: "Luciana - AM",
        action: "iniciou seu ritual de jejum e oração.",
        subtitle: "O chamado foi ouvido. O corpo vai responder.",
      },
      {
        name: "Camila - CE",
        action: "garantiu a oferta especial de R$19,70.",
        subtitle: "Fez da fé seu ponto de partida.",
      },
      {
        name: "Débora - GO",
        action: "começou o plano de 30 dias.",
        subtitle: "Renovando o espírito e secando o corpo.",
      },
      {
        name: "Talita - PE",
        action: "escolheu transformar a vida em oração.",
        subtitle: "Agora é ela, Deus e uma xícara de café.",
      },
    ],
    [],
  )

  const beforeAfterImages = useMemo(
    () => [
      {
        src: "https://i.postimg.cc/W1jHs5bR/CONVERTER-1.webp",
        alt: "Antes e Depois 1",
        result: "Perdeu 7kg em 2 semanas",
      },
      {
        src: "https://i.postimg.cc/jdy1VpTQ/CONVERTER-2.webp",
        alt: "Antes e Depois 2",
        result: "Perdeu 5kg em 10 dias",
      },
      {
        src: "https://i.postimg.cc/vmZ2VDV3/CONVERTER-3.webp",
        alt: "Antes e Depois 3",
        result: "Perdeu 6kg em 3 semanas",
      },
      {
        src: "https://i.postimg.cc/YC3y0Qhv/CONVERTER-4.webp",
        alt: "Antes e Depois 4",
        result: "Perdeu 4kg em 1 semana",
      },
    ],
    [],
  )

  const testimonials = useMemo(
    () => [
      {
        image: "https://i.postimg.cc/CKrPHYCY/DEPOIMENTO-1.webp",
        text: "Comprei com objetivo de emagrecer, mas além disso, reestabeleci minha fé. Em 3 dias minhas enxaquecas cessaram. Perdi 6,4kg em 2 semanas e encontrei paz interior.",
        rating: 5,
      },
      {
        image: "https://i.postimg.cc/8cMZS62P/DEPOIMENTO-2.webp",
        text: "Cada manhã com café e oração mudou minha vida. Não é só sobre o peso, é sobre propósito. Me sinto renovada.",
        rating: 5,
      },
      {
        image: "https://i.postimg.cc/j5W8M9vf/DEPOIMENTO-3.webp",
        text: "Deus usou esse protocolo para me libertar da ansiedade alimentar. Perdi 5kg e ganhei uma nova perspectiva de vida.",
        rating: 5,
      },
    ],
    [],
  )

  // Optimized event handlers with useCallback
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterImages.length)
  }, [beforeAfterImages.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + beforeAfterImages.length) % beforeAfterImages.length)
  }, [beforeAfterImages.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }, [touchStart, touchEnd, nextSlide, prevSlide])

  const scrollToOffer = useCallback(() => {
    const offerSection = document.querySelector("#offer-box")
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const acceptCookies = useCallback(() => {
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    document.cookie = `cookie_consent=accepted; expires=${expiryDate.toUTCString()}; path=/`
    setShowCookieBanner(false)
  }, [])

  const closeNotification = useCallback(() => {
    setShowNotification(false)
  }, [])

  const closeCookieBanner = useCallback(() => {
    setShowCookieBanner(false)
  }, [])

  // Optimized effects
  useEffect(() => {
    setIsVisible(true)

    const checkCookieConsent = () => {
      const cookies = document.cookie.split(";")
      const consentCookie = cookies.find((cookie) => cookie.trim().startsWith("cookie_consent="))

      if (!consentCookie || !consentCookie.includes("accepted")) {
        setShowCookieBanner(true)
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkCookieConsent)
    } else {
      checkCookieConsent()
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", checkCookieConsent)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(false)
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
        setShowNotification(true)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [notifications.length])

  return (
    <div className="min-h-screen bg-primary-dark font-system text-primary-white">
      {/* NOTIFICAÇÃO DE VENDAS */}
      <NotificationCard
        notification={notifications[currentNotification]}
        showNotification={showNotification}
        onClose={closeNotification}
      />

      {/* BOTÃO FLUTUANTE FIXO */}
      <FloatingButton onClick={scrollToOffer} />

      {/* BANNER DE COOKIES */}
      <CookieBanner showCookieBanner={showCookieBanner} onAccept={acceptCookies} onClose={closeCookieBanner} />

      {/* SEÇÃO 1 - CHAMADA ESPIRITUAL EMOCIONAL */}
      <section className="relative min-h-screen flex items-center justify-center bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-orange-500/10"></div>

        <div
          className={`container mx-auto px-4 py-20 z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight font-system">
              <span className="block text-white">PROPÓSITO SAGRADO</span>
              <span className="block text-primary-orange">QUE TRANSFORMA</span>
              <span className="block text-white">CORPO E ESPÍRITO</span>
            </h1>

            <p className="text-xl md:text-2xl font-bold text-white mb-12 max-w-4xl mx-auto leading-relaxed font-system">
              Mulheres estão emagrecendo até <span className="text-primary-orange font-extrabold">5kg por semana</span>{" "}
              com um ritual simples:
              <br />
              <span className="text-primary-orange font-extrabold">Jejum espiritual com café preto</span> — e a{" "}
              <span className="text-white font-extrabold">Palavra de Deus</span> como guia.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-12">
            <HeroVideo />
          </div>

          <div className="text-center">
            <a
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide mb-6 inline-block font-system"
            >
              ☕ QUERO EMAGRECER EM PROPÓSITO COM DEUS!
            </a>

            <div className="text-center text-white text-lg font-semibold font-system">
              🙏 Jejum guiado | ☕ Café preto natural | 📖 Bíblia como âncora
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 - IDENTIFICAÇÃO COM A DOR */}
      <section className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="w-24 h-24 mx-auto mb-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">😔</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white font-system">
                VOCÊ RECONHECE ESSES <span className="text-primary-orange font-extrabold">SINAIS</span>?
              </h2>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-orange-500/20">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <p className="text-lg text-white font-medium font-system">
                      Cansaço ao acordar, mesmo dormindo 8 horas
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <p className="text-lg text-white font-medium font-system">Sensação constante de inchaço</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <p className="text-lg text-white font-medium font-system">Perda de foco durante o dia</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <p className="text-lg text-white font-medium font-system">Desânimo espiritual</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <p className="text-lg text-white font-medium font-system">Ansiedade alimentar</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <p className="text-lg text-white font-medium font-system">Baixa autoestima</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-orange-500/30">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4 font-system">
                  Se isso é familiar, <span className="text-primary-orange font-extrabold">você não está sozinha</span>.
                </p>
              </div>
            </div>

            <a
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
            >
              ☕ QUERO SAIR DESSE CICLO
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 - CONFLITO COM O MERCADO ATUAL */}
      <section className="py-20 bg-primary-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="w-24 h-24 mx-auto mb-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <X className="w-12 h-12 text-orange-400" />
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white font-system">
                PARE DE CAIR NAS <span className="text-primary-orange font-extrabold">MESMAS ARMADILHAS</span>
              </h2>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-orange-500/20">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🥗</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-orange-400 mb-2 font-system">Dietas Genéricas</h3>
                  <p className="text-white font-medium font-system">
                    Funcionam por 2 semanas, depois você volta ao peso anterior
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🍵</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-orange-400 mb-2 font-system">Chás Milagrosos</h3>
                  <p className="text-white font-medium font-system">Promessas vazias que só drenam sua carteira</p>
                </div>

                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-orange-400 mb-2 font-system">Jejuns Aleatórios</h3>
                  <p className="text-white font-medium font-system">Sem propósito e ciência, tudo é temporário</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-orange-500/30">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-bold font-system">
                  <span className="text-primary-orange font-extrabold">Sem propósito e ciência</span>, qualquer método é
                  apenas mais uma tentativa frustrada.
                </p>
              </div>
            </div>

            <a
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
            >
              ☕ QUERO UM MÉTODO REAL
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 - INTRODUÇÃO AO MÉTODO */}
      <section className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">☕</span>
                </div>
                <Zap className="w-8 h-8 text-orange-400" />
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⚡</span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white font-system">
                CONHEÇA O <span className="text-primary-orange font-extrabold">JEJUM COM CAFÉ PRETO</span>
              </h2>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-orange-500/20">
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-bold font-system">
                <span className="text-primary-orange font-extrabold">Jejum com Café Preto</span> é um protocolo{" "}
                <span className="text-orange-400 font-extrabold">simples</span>,{" "}
                <span className="text-orange-300 font-extrabold">ancestral</span> e{" "}
                <span className="text-orange-200 font-extrabold">validado pela ciência</span>.
              </p>

              <p className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-bold font-system">
                Nada de modinha.
              </p>

              <div className="bg-gradient-to-r from-orange-500/20 to-orange-500/20 rounded-xl p-6 mb-8 border border-orange-600/30">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-bold font-system">
                  Você acorda, toma um café puro e deixa o{" "}
                  <span className="text-primary-orange font-extrabold">corpo</span> e a{" "}
                  <span className="text-orange-400 font-extrabold">mente</span> entrarem em modo de{" "}
                  <span className="text-orange-300 font-extrabold">cura</span>.
                </p>
              </div>
            </div>

            <a
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
            >
              ☕ QUERO CONHECER O MÉTODO
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 - EXPLICAÇÃO CIENTÍFICA */}
      <section className="py-20 bg-primary-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-system">
              <span className="text-orange-400 font-extrabold">CIÊNCIA</span> +{" "}
              <span className="text-orange-300 font-extrabold">FÉ</span> ={" "}
              <span className="text-primary-orange font-extrabold">RESULTADO</span>
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Bloco Científico */}
              <div className="bg-orange-500/10 rounded-2xl p-8 border border-orange-400/20">
                <div className="flex items-center mb-6">
                  <Brain className="w-12 h-12 text-orange-400 mr-4" />
                  <h3 className="text-2xl font-black text-orange-400 font-system">BLOCO CIENTÍFICO</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">🔥</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Lipólise</h4>
                      <p className="text-white font-medium font-system">Queima gordura sem atacar músculos</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">⚡</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Aumento de Dopamina</h4>
                      <p className="text-white font-medium font-system">Mais foco e energia natural</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">🧬</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Autofagia</h4>
                      <p className="text-white font-medium font-system">Limpeza celular profunda</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">📊</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Estabilidade de Insulina</h4>
                      <p className="text-white font-medium font-system">Sem compulsão alimentar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco Espiritual */}
              <div className="bg-orange-600/10 rounded-2xl p-8 border border-orange-500/20">
                <div className="flex items-center mb-6">
                  <Heart className="w-12 h-12 text-orange-500 mr-4" />
                  <h3 className="text-2xl font-black text-orange-500 font-system">BLOCO ESPIRITUAL</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">📖</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Jejum como Prática Bíblica</h4>
                      <p className="text-white font-medium font-system">Tradição milenar de purificação</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">🙏</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Conexão Profunda com Deus</h4>
                      <p className="text-white font-medium font-system">Fortalecimento da fé e propósito</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✨</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Renovação Interior</h4>
                      <p className="text-white font-medium font-system">Transformação que vem de dentro</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">💪</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 font-system">Disciplina Espiritual</h4>
                      <p className="text-white font-medium font-system">Fortalecimento da vontade</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <a
                href="https://go.disruptybr.com.br/q1yutawwn5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
              >
                ☕ QUERO ALIAR CIÊNCIA E FÉ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 - CAFÉ GPT */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 via-primary-dark to-orange-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="w-24 h-24 mx-auto mb-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-orange-400" />
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white font-system">
                CONHEÇA A <span className="text-primary-orange font-extrabold">CAFÉ GPT</span>
              </h2>

              <p className="text-xl md:text-2xl text-white mb-8 font-bold font-system">
                A IA que acompanha você 24h, enviando versículos, dicas alimentares, motivação e monitoramento do
                progresso.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
                <h3 className="text-2xl font-bold text-orange-400 mb-6 font-system">Benefícios da Café GPT:</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                    <p className="text-white font-medium font-system">Motivação diária personalizada</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                    <p className="text-white font-medium font-system">Versículo e reflexão matinal</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                    <p className="text-white font-medium font-system">Ajustes personalizados no protocolo</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                    <p className="text-white font-medium font-system">Check-ins emocionais</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                    <p className="text-white font-medium font-system">Receitas leves e saudáveis</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                    <p className="text-white font-medium font-system">Lembretes de quebra de jejum</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 rounded-2xl p-8 border border-orange-400/20">
                <h3 className="text-xl font-bold text-white mb-4 font-system">Exemplo de Conversa:</h3>
                <div className="space-y-3 text-left">
                  <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-400/30">
                    <p className="text-sm text-orange-300 font-semibold font-system">Café GPT</p>
                    <p className="text-white font-medium font-system">Bom dia! Como você está se sentindo hoje? 🌅</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 ml-4 border border-orange-600/30">
                    <p className="text-sm text-orange-400 font-semibold font-system">Você</p>
                    <p className="text-white font-medium font-system">Meio desanimada...</p>
                  </div>
                  <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-400/30">
                    <p className="text-sm text-orange-300 font-semibold font-system">Café GPT</p>
                    <p className="text-white font-medium font-system">
                      Entendo. Lembre-se: "Posso todas as coisas naquele que me fortalece" (Filipenses 4:13). Que tal
                      começarmos com seu café e uma oração? ☕🙏
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
            >
              ☕ QUERO O SUPORTE DA CAFÉ GPT
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 - COMO FUNCIONA O PROTOCOLO */}
      <section className="py-20 bg-primary-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-white font-system">
              COMO FUNCIONA O <span className="text-primary-orange font-extrabold">PROTOCOLO</span>
            </h2>

            <div className="space-y-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 flex items-center space-x-6 border border-orange-500/20">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xl font-system">1</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold text-white font-system">Café em Jejum</h3>
                  </div>
                  <p className="text-white font-medium font-system">
                    Acorde e tome seu café preto, sem açúcar ou adoçante
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 flex items-center space-x-6 border border-orange-500/20">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xl font-system">2</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📖</span>
                    <h3 className="text-xl font-bold text-white font-system">Oração Devocional</h3>
                  </div>
                  <p className="text-white font-medium font-system">Dedique 10 minutos para oração e leitura bíblica</p>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 flex items-center space-x-6 border border-orange-500/20">
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xl font-system">3</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">⏰</span>
                    <h3 className="text-xl font-bold text-white font-system">Jejum de 12 a 16h</h3>
                  </div>
                  <p className="text-white font-medium font-system">Mantenha o jejum pelo período determinado</p>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 flex items-center space-x-6 border border-orange-500/20">
                <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xl font-system">4</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🍽️</span>
                    <h3 className="text-xl font-bold text-white font-system">Quebra Leve</h3>
                  </div>
                  <p className="text-white font-medium font-system">Alimente-se de forma consciente e saudável</p>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 flex items-center space-x-6 border border-orange-500/20">
                <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-800 font-black text-xl font-system">5</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold text-white font-system">Mensagem da Café GPT</h3>
                  </div>
                  <p className="text-white font-medium font-system">Receba orientação personalizada e motivação</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="https://go.disruptybr.com.br/q1yutawwn5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
              >
                ☕ QUERO SEGUIR ESSE RITUAL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8 - AUTORIDADE DA CRIADORA */}
      <section className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Imagem da Especialista */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <OptimizedImage
                    src="https://i.postimg.cc/CxGdqxgB/expert-jejum-cafe.webp"
                    alt="Dra. Especialista em Nutrição Funcional"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-orange-600/30"
                    priority={true}
                  />
                  <div className="absolute -bottom-4 -right-4 bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm font-system">
                    +8 anos de experiência
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white font-system">
                  MÉTODO CRIADO POR QUEM TEM{" "}
                  <span className="text-primary-orange font-extrabold">CIÊNCIA NA MENTE</span> E{" "}
                  <span className="text-orange-400 font-extrabold">DEUS NO CORAÇÃO</span>
                </h2>

                <div className="space-y-6 text-white">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-orange-500">
                    <p className="text-lg leading-relaxed text-white font-bold font-system">
                      "Eu atendo mulheres cristãs todos os dias.
                      <br />
                      Percebi que não é só sobre perder peso...
                      <br />É sobre resgatar <span className="text-primary-orange font-extrabold">autoestima</span>,{" "}
                      <span className="text-orange-400 font-extrabold">fé</span> e{" "}
                      <span className="text-orange-300 font-extrabold">saúde</span>.<br />O 'Jejum com Café Preto\' une
                      a ciência com o propósito espiritual."
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                      <span className="text-orange-400 font-semibold font-system">✓ Nutrição Clínica Funcional</span>
                    </div>
                    <div className="bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                      <span className="text-orange-400 font-semibold font-system">✓ Especialista em Emagrecimento</span>
                    </div>
                    <div className="bg-orange-600/20 px-4 py-2 rounded-full border border-orange-600/30">
                      <span className="text-orange-500 font-semibold font-system">✓ +19.500 mulheres atendidas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 9 - FAQ - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="py-20 bg-primary-dark flex items-center justify-center">
            <div className="animate-pulse text-white">Carregando...</div>
          </div>
        }
      >
        <LazyFAQSection />
      </Suspense>

      {/* SEÇÃO 10 - NÚMEROS IMPACTANTES */}
      <section className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-system">
            NÚMEROS QUE <span className="text-primary-orange font-extrabold">IMPRESSIONAM</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-orange-500/20">
              <Users className="w-12 h-12 text-primary-orange mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-2 font-system">+19.500</h3>
              <p className="text-white font-medium font-system">pessoas testaram o protocolo em 2025</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-orange-500/20">
              <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-2 font-system">92%</h3>
              <p className="text-white font-medium font-system">relataram perda de peso nos primeiros 7 dias</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-orange-500/20">
              <CheckCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-2 font-system">87%</h3>
              <p className="text-white font-medium font-system">
                afirmaram melhora na disposição, no humor e redução de dores como enxaqueca
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-orange-500/20">
              <Star className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white mb-2 font-system">9.4</h3>
              <p className="text-white font-medium font-system">de satisfação média nas avaliações</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center md:col-span-2 lg:col-span-2 border border-orange-500/20">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-4">☕</span>
                <span className="text-4xl">→</span>
                <span className="text-4xl ml-4">💪</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2 font-system">1 copo de café</h3>
              <p className="text-white font-medium font-system">1 corpo em transformação</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 11 - BÔNUS EXCLUSIVOS */}
      <section className="py-20 bg-primary-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-8 text-white font-system">
            PRESENTES PARA <span className="text-primary-orange font-extrabold">FORTALECER SUA JORNADA</span>
          </h2>

          <p className="text-xl text-center text-white mb-16 max-w-3xl mx-auto font-bold font-system">
            Receba ferramentas extras para fortalecer corpo, alma e propósito
          </p>

          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            {[
              {
                icon: <Gift className="w-8 h-8 text-orange-400" />,
                title: "📓 Receitas com Café para quebrar a gordura e fortalecer a mente",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-orange-400" />,
                title: "✅ Checklist espiritual e físico diário",
              },
              {
                icon: <Users className="w-8 h-8 text-orange-400" />,
                title: "👭 Grupo de apoio com outras mulheres de fé",
              },
            ].map((bonus, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 flex items-center space-x-4 border border-orange-500/20"
              >
                {bonus.icon}
                <h3 className="text-xl font-bold text-white font-system">{bonus.title}</h3>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
            >
              <span className="cursor-pointer">💡 SIM, QUERO O PROTOCOLO SAGRADO DE JEJUM AGORA</span>
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 12 - OFERTA */}
      <section
        id="offer-section"
        className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-white font-system">
              UM GUIA PARA O <span className="text-primary-orange font-extrabold">CORPO</span>, UM CAMINHO PARA A{" "}
              <span className="text-orange-400 font-extrabold">MENTE</span>, UMA FERRAMENTA PARA A{" "}
              <span className="text-orange-300 font-extrabold">FÉ</span>
            </h2>

            <div
              id="offer-box"
              className="bg-gradient-to-r from-orange-500/20 to-orange-500/20 rounded-2xl p-8 md:p-12 mb-12 border border-orange-600/30"
            >
              <OptimizedImage
                src="https://i.postimg.cc/sxP7D9wx/jejum-cafe-preto-semfundo.webp"
                alt="Mockup do Protocolo"
                className="w-full max-w-2xl mx-auto mb-8 rounded-2xl shadow-2xl"
                priority={true}
              />

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8 border border-orange-500/20">
                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  {[
                    "📜 Método divino de jejum com princípios naturais e espirituais",
                    "🕊️ Roteiro devocional para 7, 14 e 30 dias",
                    "🍽️ Ajustes de rotina sem dieta restritiva",
                    "📖 Versículos e orações para manter o foco",
                    "🔥 Calendário visual de progresso",
                    "🤖 Café GPT - Sua assistente de jejum 24h",
                  ].map((item, index) => (
                    <p key={index} className="text-lg md:text-xl text-white font-medium font-system">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-8 text-white font-system">💣 TUDO ISSO POR APENAS:</h3>

              <div className="mb-8">
                <p className="text-2xl text-primary-orange line-through mb-2 font-bold font-system">De: R$97</p>
                <p className="text-5xl md:text-6xl font-black text-primary-orange mb-2 font-system">R$19,70</p>
                <p className="text-xl text-white font-bold font-system">à vista </p>
              </div>

              <a
                href="https://go.disruptybr.com.br/q1yutawwn5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
              >
                💡 SIM, QUERO O PROTOCOLO SAGRADO DE JEJUM AGORA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 13 - GARANTIA */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 via-primary-dark to-orange-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-white font-system">
              UMA PROMESSA TRIPLA: <span className="text-orange-300 font-extrabold">RESULTADO</span>,{" "}
              <span className="text-orange-400 font-extrabold">APOIO</span> E{" "}
              <span className="text-primary-orange font-extrabold">HONESTIDADE</span>
            </h2>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-orange-500/20">
              <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed font-bold font-system">
                Se em 7 dias você não se sentir mais leve, animada e motivada...
                <br />
                Seu dinheiro é devolvido. Sem julgamentos. Sem enrolação.
              </p>

              <div className="space-y-6">
                {[
                  {
                    level: "Nível 1",
                    text: "Se não perder 2kg em 7 dias, reembolso imediato",
                    color: "text-orange-300",
                  },
                  {
                    level: "Nível 2",
                    text: "Fica com todos os bônus mesmo pedindo reembolso",
                    color: "text-orange-400",
                  },
                  {
                    level: "Nível 3",
                    text: "Suporte 1:1 com especialista por 3 dias",
                    color: "text-orange-500",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Shield className={`w-8 h-8 ${item.color}`} />
                    <div className="text-left">
                      <h3 className={`text-xl font-bold ${item.color} font-system`}>{item.level}</h3>
                      <p className="text-white font-medium font-system">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-orange-500/30">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4 font-system">SEM RISCO. SÓ RESULTADO.</p>
                <p className="text-lg text-white font-bold font-system">🔰 Proteção Completa | Compra Segura 🔰</p>
              </div>
            </div>

            <a
              onClick={scrollToOffer}
              href="https://go.disruptybr.com.br/q1yutawwn5"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide inline-block font-system"
            >
              💡 SIM, QUERO O PROTOCOLO SAGRADO DE JEJUM AGORA
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 15 - RESULTADOS REAIS - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="py-20 bg-primary-dark flex items-center justify-center">
            <div className="animate-pulse text-white">Carregando resultados...</div>
          </div>
        }
      >
        <LazyResultsSection
          beforeAfterImages={beforeAfterImages}
          currentSlide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          setCurrentSlide={setCurrentSlide}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />
      </Suspense>

      {/* SEÇÃO 16 - DEPOIMENTOS - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="py-20 bg-gradient-to-br from-orange-600/10 via-primary-dark to-orange-500/10 flex items-center justify-center">
            <div className="animate-pulse text-white">Carregando depoimentos...</div>
          </div>
        }
      >
        <LazyTestimonialsSection testimonials={testimonials} />
      </Suspense>

      {/* SEÇÃO 14 - URGÊNCIA FINAL */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 via-primary-dark to-orange-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-white font-system">
              VOCÊ NÃO CHEGOU AQUI <span className="text-primary-orange font-extrabold">POR ACASO</span>. É UM{" "}
              <span className="text-orange-400 font-extrabold">CHAMADO</span>.
            </h2>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-orange-500/20">
              <div className="space-y-6">
                {[
                  "⏰ Comece ainda hoje o propósito das 7 manhãs",
                  "📉 Resultados físicos e espirituais em 48h",
                  "🎁 Bônus e grupo exclusivo para quem decidir agora",
                ].map((item, index) => (
                  <p key={index} className="text-xl md:text-2xl font-bold text-white font-system">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <a
                href="https://go.disruptybr.com.br/q1yutawwn5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg md:text-xl px-8 py-4 rounded-full hover:from-orange-500 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide w-full md:w-auto inline-block font-system"
              >
                SIM, EU QUERO INICIAR MEU JEJUM COM CAFÉ E COM DEUS!
              </a>

              <p className="text-sm text-primary-orange font-medium font-system">
                <Clock className="w-4 h-4 inline mr-1" />
                Oferta por tempo limitado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-8 border-t border-orange-500/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-orange font-medium font-system">
            © 2025 Protocolo Jejum com Café Preto. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
