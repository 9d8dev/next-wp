"use client";

import { motion } from "framer-motion"; // Import Framer Motion
import Image from "next/image";
import Link from "next/link";
import domlau from "@/public/images/verdadeiradomlau.jpg";

// Variantes para animação
const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};
const fadeDownVariant = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  return (
    <section className="max-w-[1400px] mx-auto">
      <div className=" flex flex-col md:flex-row items-center justify-center md:px-8 ">
        {/* Texto e Botões */}
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          {/* Avaliação Uber Eats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeDownVariant}
            transition={{ duration: 0.5, delay: 1 }}
            className="bg-[#ee252c] inline-block text-md font-bold text-[#fbd605] px-4 py-4 fo rounded-full mb-4"
          >
            ⭐ ⭐ ⭐ ⭐ ⭐
          </motion.div>
          {/* Título */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeDownVariant}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold  mb-4"
          >
            Bem vindo a
          </motion.h1>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeDownVariant}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold mb-4"
          >
            Pizzaria Dom Lau
          </motion.h1>
          {/* Descrição */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeDownVariant}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 mb-6"
          >
            É um prazer ter você conosco, navegue pelo site e conheça nossas
            especialidades!
          </motion.p>
          {/* Botões */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeDownVariant}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4 justify-center md:justify-start"
          >
            <Link
              href="#book-table"
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
            >
              Book table
            </Link>
            <Link
              href="#explore-menu"
              className="border-2 border-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
            >
              Explore menu
            </Link>
          </motion.div>
        </div>

        {/* Imagem do Hambúrguer com Fundo Arredondado */}
        <div className="relative md:w-1/2 flex justify-center">
          {/* Fundo Arredondado com Animação */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bg-[#fbd605] w-full h-full rounded-[32px] -z-10  md:bottom-[1.5rem]"
          ></motion.div>
          {/* Imagem com Animação */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Image
              src={domlau}
              alt="Delicious Burger"
              width={700}
              height={500}
              className="rounded-[32px] shadow-lg w-full h-auto mt-4 md:mt-0 not-prose relative left-[0] md:left-[1.5rem] "
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
