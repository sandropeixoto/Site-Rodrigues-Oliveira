import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Scale,
  Briefcase,
  ShieldCheck,
  Landmark,
  Calculator,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Menu,
  X,
  Facebook,
  Instagram,
} from "lucide-react";

const logo = import.meta.env.BASE_URL + "logo.jpg";
const marca = import.meta.env.BASE_URL + "marca.jpg";
const reuniaoAtendimento = import.meta.env.BASE_URL + "reuniao-atendimento.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const contactSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z
    .string()
    .min(10, { message: "Telefone inválido (mínimo 10 dígitos)" }),
  area: z.string().min(1, { message: "Selecione uma área" }),
  message: z
    .string()
    .min(10, { message: "A mensagem deve ter no mínimo 10 caracteres" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 11) value = value.slice(0, 11);

    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (value.length > 2) {
      if (value.length <= 10) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }

    // Remove trailing dash or space if typing backspace
    value = value.replace(/-$/, "").replace(/ $/, "");

    setValue("phone", value, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://mail-proxy-has46dauxa-rj.a.run.app/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: `Área de Interesse: ${data.area}\n\nMensagem:\n${data.message}`,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar mensagem");
      }

      setSubmitStatus("success");
      reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (err: any) {
      console.error(err);
      setSubmitStatus("error");
      setErrorMessage(
        err.message ||
          "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "#home" },
    { name: "O Escritório", href: "#about" },
    { name: "Áreas de Atuação", href: "#services" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-brand-navy selection:text-white">
      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo Rodrigues & Oliveira"
              className="h-16 md:h-20 w-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="px-6 py-2.5 bg-brand-navy text-white text-sm font-medium rounded-sm hover:bg-slate-800 transition-colors"
            >
              Fale Conosco
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-800"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-6 shadow-2xl"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-8 h-8 text-slate-800" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl text-brand-navy"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-8 px-8 py-3 bg-brand-navy text-white text-lg rounded-sm"
              >
                Fale Conosco agora
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 bg-white overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-slate-100 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-amber-50 rounded-full blur-3xl opacity-60 -z-10 mix-blend-multiply pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <motion.div
            className="flex-1 space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              className="flex items-center gap-3 text-brand-gold font-medium text-sm tracking-widest uppercase"
            >
              <div className="w-8 h-[1px] bg-brand-gold"></div>
              Excelência e Tradição
            </motion.div>

            <motion.h2
              variants={fadeIn}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-brand-navy"
            >
              Defesa sólida <br className="hidden md:block" /> para o seu{" "}
              <span className="italic text-brand-gold">futuro</span>.
            </motion.h2>

            <motion.p
              variants={fadeIn}
              className="text-lg text-slate-600 max-w-xl leading-relaxed"
            >
              Com expertise focada em resultados ágeis e eficientes, oferecemos
              consultoria jurídica e atuação contenciosa para empresas e
              indivíduos, protegendo seus direitos com integridade.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-brand-navy text-white hover:bg-slate-800 transition-colors rounded-sm font-medium flex items-center gap-2"
              >
                Agendar Consulta
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="px-8 py-4 bg-white border border-slate-200 text-brand-navy hover:bg-slate-50 transition-colors rounded-sm font-medium"
              >
                Nossas Áreas
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 w-full flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md mx-auto md:ml-auto md:mr-0 z-10 flex flex-col items-center justify-center">
              <img
                src={marca}
                alt="Marca Rodrigues & Oliveira"
                className="w-[80%] h-auto object-contain mix-blend-multiply opacity-90"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-slate-50 px-6 md:px-12 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <motion.div
            className="flex-1 w-full relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/50 via-brand-navy/10 to-brand-gold/30 mix-blend-multiply z-10 pointer-events-none"></div>
              <img
                src={reuniaoAtendimento}
                alt="Reunião de Atendimento"
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Elementos Decorativos */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-gold rounded-full mix-blend-multiply opacity-20 blur-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-brand-navy rounded-full mix-blend-multiply opacity-10 blur-2xl -z-10"></div>
          </motion.div>

          <motion.div
            className="flex-1 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <h3 className="text-brand-gold text-sm tracking-widest uppercase font-medium">
              Sobre a Equipe
            </h3>
            <h2 className="font-serif text-4xl leading-tight text-brand-navy font-semibold">
              Experiência consolidada, <br /> atendimento personalizado.
            </h2>
            <div className="w-16 h-[2px] bg-brand-gold"></div>
            <p className="text-slate-600 leading-relaxed text-lg pt-4">
              Pautados pela ética e dedicação, nosso escritório reúne uma equipe
              de advogados altamente qualificados, com vivência prática e
              acadêmica de excelência.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Acreditamos que o Direito deve ser uma ferramenta de pacificação
              social e segurança. Por isso, tratamos cada caso de forma única,
              traçando estratégias inteligentes para antecipar problemas,
              resolver impasses e assegurar vitórias sólidas.
            </p>

            <div className="pt-8 space-y-6">
              <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
                <h4 className="font-serif text-xl text-brand-navy mb-1 font-semibold">
                  Taciel Rodrigues Monteiro
                </h4>
                <p className="text-sm font-medium text-brand-gold uppercase tracking-wide mb-3">
                  OAB/PA 21.042
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-medium">
                    WhatsApp: (91) 99133-7615
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
                <h4 className="font-serif text-xl text-brand-navy mb-1 font-semibold">
                  Juarez Antônio Oliveira de Souza Junior
                </h4>
                <p className="text-sm font-medium text-brand-gold uppercase tracking-wide mb-3">
                  OAB/PA 26.564
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-medium">
                    WhatsApp: (91) 98522-4029
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h3 className="text-brand-gold text-sm tracking-widest uppercase font-medium">
              Nossas Especialidades
            </h3>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-navy font-semibold">
              Áreas de Atuação
            </h2>
            <div className="w-16 h-[2px] bg-brand-gold mx-auto mt-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: "Cível",
                description:
                  "Proteção aos seus direitos no dia a dia. Atuamos em contratos, responsabilidade civil, família, sucessões e resolução de conflitos, garantindo segurança patrimonial.",
              },
              {
                icon: ShieldCheck,
                title: "Trabalhista",
                description:
                  "Defesa firme no ambiente de trabalho. Auxiliamos empregados e empregadores na garantia de direitos, prevenção de litígios e atuação contenciosa em todas as instâncias.",
              },
              {
                icon: Landmark,
                title: "Previdenciário",
                description:
                  "Respeito ao que você construiu. Especialistas na concessão de aposentadorias, pensões, auxílios e no planejamento previdenciário para assegurar um futuro tranquilo.",
              },
              {
                icon: Scale,
                title: "Administrativo",
                description:
                  "Sua segurança perante o Poder Público. Assessoria jurídica contínua em licitações, contratos administrativos, processos disciplinares e defesa contra abusos estatais.",
              },
              {
                icon: Calculator,
                title: "Tributário",
                description:
                  "Garantia de conformidade e justiça fiscal. Especialista na área de Imposto de Renda Pessoa Física, orientação em malhas fiscais, isenções, contestações e planejamento tributário.",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-slate-100 hover:border-brand-navy/20 transition-all duration-300 group"
              >
                <service.icon
                  className="w-10 h-10 text-brand-gold mb-6 group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
                <h3 className="font-serif text-xl font-semibold text-brand-navy mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 px-6 md:px-12 bg-brand-navy text-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          <motion.div
            className="flex-1 space-y-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="space-y-4">
              <h3 className="text-brand-gold text-sm tracking-widest uppercase font-medium">
                Agende seu horário
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold">
                Entre em contato
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-md pt-4">
                Estamos prontos para entender seu caso e apresentar as melhores
                soluções jurídicas. Ligue ou preencha o formulário.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-slate-400 font-medium mb-1">
                    Telefone Fixo
                  </h4>
                  <p className="text-lg">(91) 99133-7615</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Atendimento em horário comercial
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-slate-400 font-medium mb-1">
                    E-mail
                  </h4>
                  <a
                    href="mailto:rodrigueseoliveira.adv.jus@gmail.com"
                    className="text-lg hover:text-brand-gold transition-colors break-all"
                  >
                    rodrigueseoliveira.adv.jus@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-slate-400 font-medium mb-1">
                    Endereço
                  </h4>
                  <p className="text-lg leading-relaxed">
                    Rua Ó de Almeida, nº 490
                    <br />
                    Ed. Rotary, Sala 704, Campina
                    <br />
                    Belém/PA, CEP: 66017-050
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 bg-white p-8 md:p-10 rounded-sm"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 text-green-800 p-4 rounded-sm border border-green-200 text-sm font-medium"
                  >
                    Sua mensagem foi enviada com sucesso! Entraremos em contato
                    em breve.
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 text-red-800 p-4 rounded-sm border border-red-200 text-sm font-medium"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Nome Completo
                </label>
                <motion.input
                  type="text"
                  id="name"
                  {...register("name")}
                  animate={errors.name ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.name ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-brand-navy/20 focus:border-brand-navy"} rounded-sm focus:outline-none focus:ring-2 transition-all text-slate-800`}
                  placeholder="Seu nome"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    E-mail
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    {...register("email")}
                    animate={errors.email ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-brand-navy/20 focus:border-brand-navy"} rounded-sm focus:outline-none focus:ring-2 transition-all text-slate-800`}
                    placeholder="voce@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Telefone
                  </label>
                  <motion.input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    onChange={(e) => {
                      register("phone").onChange(e); // allow react-hook-form to track it
                      handlePhoneChange(e); // format the value and update form state
                    }}
                    animate={errors.phone ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.phone ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-brand-navy/20 focus:border-brand-navy"} rounded-sm focus:outline-none focus:ring-2 transition-all text-slate-800`}
                    placeholder="(91) 99999-9999"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Área de Interesse
                </label>
                <motion.select
                  id="area"
                  {...register("area")}
                  animate={errors.area ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.area ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-brand-navy/20 focus:border-brand-navy"} rounded-sm focus:outline-none focus:ring-2 transition-all text-slate-800`}
                >
                  <option value="">Selecione uma área</option>
                  <option value="civel">Cível</option>
                  <option value="trabalhista">Trabalhista</option>
                  <option value="previdenciario">Previdenciário</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="tributario">Tributário</option>
                  <option value="outro">Outro / Não sei informar</option>
                </motion.select>
                {errors.area && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.area.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Mensagem
                </label>
                <motion.textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  animate={errors.message ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.message ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-brand-navy/20 focus:border-brand-navy"} rounded-sm focus:outline-none focus:ring-2 transition-all text-slate-800 resize-none`}
                  placeholder="Conte-nos brevemente o seu caso..."
                ></motion.textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-gold text-white font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Enviar Mensagem"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5591991337615?text=Olá,%20gostaria%20de%20marcar%20um%20atendimento."
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] transition-all"
        aria-label="Contato via WhatsApp"
      >
        <WhatsappIcon className="w-8 h-8" />
      </motion.a>

      {/* Footer */}
      <footer className="bg-black py-12 px-6 md:px-12 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-brand-gold" />
              <span className="font-serif text-white font-semibold tracking-wide text-lg">
                Rodrigues & Oliveira
              </span>
            </div>

            <p className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Rodrigues & Oliveira Consultoria
              e Assessoria Jurídica.
              <br className="md:hidden" /> Todos os direitos reservados.
            </p>

            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors text-slate-400"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/rodrigueseoliveira.adv"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors text-slate-400"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center border-t border-slate-800/50 pt-8">
            <a
              href="https://nano.net.br"
              target="_blank"
              rel="noreferrer"
              className="text-brand-gold text-sm hover:opacity-80 transition-opacity"
            >
              Desenvolvido por NANO
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
