"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Obter a altura da seção
  useEffect(() => {
    if (sectionRef.current) {
      setSectionHeight(sectionRef.current.offsetHeight);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // Mapeamento relativo ao componente
  });

  const isInView = useInView(sectionRef, { once: false });

  // Movimentação do mapa
  const mapY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [0, isMobile ? 100 : sectionHeight - 600] // Movimento reduzido no mobile
    ),
    {
      stiffness: 250,
      damping: 60,
    }
  );

  // Movimentação do conteúdo
  const contentY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["20%", "-100%"]),
    {
      stiffness: 250,
      damping: 60,
    }
  );

  return (
    <section ref={sectionRef} className="w-full max-w-[1400px] mx-auto relative">
      <div className="md:relative flex flex-col md:flex-row justify-between">
        {/* Mapa */}
        <motion.div
          style={{ y: isInView ? mapY : "auto" }}
          className="w-full md:w-[40%] md:absolute flex items-center justify-center"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019882850556!2d-122.08424968468278!3d37.421999579825106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba0288002c9d%3A0xdbcfba521b0bc2e3!2sGoogleplex!5e0!3m2!1sen!2sus!4v1682461873829!5m2!1sen!2sus"
            width="700"
            height="500"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[24px]"
          ></iframe>
        </motion.div>

        {/* Conteúdo */}
        <motion.div
          style={{ y: isInView ? contentY : "auto" }}
          className="w-full md:w-[65%] h-auto rounded-[24px] p-4 md:p-6 bg-[#fbd605] relative md:relative md:left-[35%]"
        >
          <div className="bg-white rounded-[16px] p-4">
            <h2 className="text-3xl font-bold text-gray-800 my-6 not-prose">
              Entre em Contato
            </h2>

            <div className="text-gray-700 mb-6">
              <p>
                <strong>Endereço:</strong>
              </p>
              <p>Rua Tanquinho, 260 - Tatuapé</p>
            </div>

            <div className="text-gray-700 mb-6">
              <p>
                <strong>Horário de Funcionamento:</strong>
              </p>
              <p>
                Horário de atendimento: Domingo a Quinta, das 18:00 às 23:30
              </p>
              <p>Sexta e Sábado, das 18:00 às 00:00</p>
            </div>

            <div className="flex gap-4">
              <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                Agendar Visita
              </button>
              <button className="border border-black text-black py-2 px-4 rounded-md hover:bg-black hover:text-white">
                Ver Menu
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
