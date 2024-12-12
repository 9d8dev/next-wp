"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import pizza from "@/public/images/pizza.jpg";

type MenuItem = {
  title: string;
  description: string;
};

interface MenuSectionProps {
  items: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ items }) => {
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

  // Movimentação da imagem
  const imageY = useSpring(
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

  // Movimentação do menu
  const menuY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]),
    {
      stiffness: 250,
      damping: 60,
    }
  );

  // Dividir itens em duas colunas
  const columns = items.reduce(
    (acc, item, index) => {
      if (index % 2 === 0) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }
      return acc;
    },
    [[], []] as [MenuItem[], MenuItem[]]
  );

  return (
    <section ref={sectionRef} className="w-full max-w-[1400px] mx-auto relative">
      <div className="md:relative flex flex-col md:flex-row justify-between">
        {/* Imagem */}
        <motion.div
          style={{ y: isInView ? imageY : "auto" }}
          className="w-full md:w-[40%] left-[0] md:absolute flex items-center justify-center"
        >
          <Image
            src={pizza}
            alt="Delicious Pizza"
            width={700}
            height={500}
            style={{ marginTop: "0", marginBottom: "0" }}
            className="rounded-[24px]"
          />
        </motion.div>

        {/* Menu */}
        <motion.div
          style={{ y: isInView ? menuY : "auto" }}
          className="w-full md:w-[65%] h-auto rounded-[24px] p-4 md:p-6 bg-[#fbd605] relative md:relative md:left-[35%]"
        >
          <div className="bg-white rounded-[16px] p-4">
            <h2 className="text-3xl font-bold text-gray-800 my-6 not-prose">Queijos</h2>

            <div className="flex gap-6">
              <div className="md:w-[50%]">
                {columns[0].map((item, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-bold text-[#ee252c] not-prose">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="md:w-[50%]">
                {columns[1].map((item, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-bold text-[#ee252c] not-prose">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
