// Craft Imports
import { Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";

// Components
import Link from "next/link";

// Icons
import { File, Pen, Tag, Boxes, User, Folder } from "lucide-react";
import HeroSection from "@/components/hero/hero-section";
import MenuSection from "@/components/menu/menu";
import MenuSectionReversed from "@/components/menu/menu-reversed";
import ContactSection from "@/components/contact/contact";

const menuItems = [
  { title: "ALEMÃ", description: "mussarela, bacon e cebola" },
  {
    title: "A MODA DA CASA",
    description: "mussarela, presunto, ovos cozidos e cebola",
  },
  {
    title: "A MODA DA CASA ESPECIAL",
    description: "mussarela, presunto, ovos cozidos, palmito e cebola",
  },
  { title: "CANELINHA", description: "alho palha e mussarela" },
  {
    title: "CARDEAL",
    description: "mussarela, pimentão vermelho, aliche e parmesão ralado",
  },
  { title: "CATUPIRY", description: "queijo catupiry" },
  { title: "CATUPIRY COM BACON", description: "catupiry com fatias de bacon" },
  { title: "CATUPIRY COM CHAMPIGNON", description: "catupiry com champignon​" },
  { title: "CHEDDAR", description: "cheddar, fatias de bacon e champignon" },
  {
    title: "DO CHEFE",
    description: "gorgonzola, presunto, tomate e parmesão ralado",
  },
  {
    title: "DOIS QUEIJOS",
    description: "combinação de dois queijos a sua escolha",
  },
  { title: "FELICITÁ", description: "catupiry, provolone, tomate e alho" },
  { title: "GORGONZOLA", description: "queijo gorgonzola" },
  { title: "GRATINADA", description: "catupiry, provolone e mussarela" },
  { title: "LIGHT", description: "mussarela de búfala e rúcula" },
  {
    title: "MARGUERITA",
    description: "manjericão, mussarela, molho, tomate e parmesão ralado",
  },
  { title: "MEXICANA", description: "milho, bacon e catupiry" },
  {
    title: "MUSSARELA",
    description: "mussarela da melhor qualidade e molho de tomate",
  },
  {
    title: "MUSSARELA COM ALCAPARRA",
    description: "mussarela, alcaparra e cebola",
  },
  {
    title: "MUSSARELA DE BÚFALA",
    description: "mussarela de búfala com molho de tomate",
  },
  {
    title: "NAPOLITANA",
    description: "mussarela, rodelas de tomate e parmesão ralado",
  },
  { title: "PROVOLONE", description: "queijo provolone e molho de tomate" },
  {
    title: "PROVOLONE COM TOMATE",
    description: "queijo provolone com tomate e orégano",
  },
  {
    title: "QUATRO QUEIJOS I",
    description: "mussarela, catupiry, provolone e gorgonzola",
  },
  {
    title: "QUATRO QUEIJOS II",
    description: "provolone, mussarela, catupiry e parmesão",
  },
  { title: "SICILIANA", description: "champignon, bacon e mussarela" },
  {
    title: "VERONESE",
    description: "mussarela de búfala, tomate seco e manjericão",
  },
  {
    title: "VESÚVIO",
    description: "mussarela coberta com calabresa refogada, cebola e azeitona",
  },
];


const menuItems2 = [
  { title: "ABOBRINHA I", description: "abobrinha coberta com mussarela" },
  { title: "ABOBRINHA II", description: "carne seca, abobrinha, parmesão, catupiry ou mussarela" },
  { title: "ALCACHOFRA I", description: "alcachofra, catupiry ou mussarela e alcaparra" },
  { title: "ALCACHOFRA II", description: "alcachofra, pimentão, mussarela de búfala e alcaparra" },
  { title: "ALHO E ÓLEO", description: "alho palha e azeite" },
  { title: "ALHO PORÔ (NOVIDADE)", description: "mussarela, alho poró e parmesão" },
  { title: "ALHO PORÔ II (NOVIDADE)", description: "peito de peru, palmito, alho poró e cream cheese" },
  { title: "BELLA", description: "alho, tomate picado, mussarela de búfala e manjericão" },
  { title: "BERINGELA", description: "beringela com mussarela" },
  { title: "BERINGELA COM ALCAPARRA", description: "beingela, mussarela e alcaparra" },
  { title: "BRÓCOLIS", description: "brócolis com mussarela ou catupiry" },
  { title: "BRÓCOLIS ESPECIAL", description: "brócolis, bacon e mussarela" },
  { title: "CHAMPIGNON", description: "champignon coberto com mussarela" },
  { title: "DOM LAU ESPECIAL", description: "peito de peru light, cebola, mussarela, catupiry salpicado com gorgonzola" },
  { title: "ESCAROLA I", description: "escarola, alho, aliche, cebola e mussarela" },
  { title: "ESCAROLA II", description: "escarola, alcaparras, mussarela e aliche" },
  { title: "FLORENÇA", description: "escarola, bacon e mussarela" },
  { title: "JARDINEIRA", description: "palmito, milho, ervilha e mussarela" },
  { title: "LIGHT II", description: "escarola, palmito, champignon e mussarela de búfala" },
  { title: "LIGHT III", description: "champignon, manjericão e mussarela de búfala" },
  { title: "LIGHT IV", description: "peito de peru, palmito, champignom e mussarela de búfala" },
  { title: "MILHO VERDE", description: "milho verde coberto com mussarela" },
  { title: "MILHO VERDE II", description: "milho verde coberto com catupiry" },
  { title: "PALMITO", description: "palmito da melhor qualidade coberto com mussarela" },
  { title: "PALMITO COM CATUPIRY", description: "palmito com catupiry" },
  { title: "PALMITO COM PROVOLONE", description: "palmito, provolone, tomate e azeitona" },
  { title: "POMODORO", description: "tomate seco, mussarela de búfala, parmesão e alcaparra" },
  { title: "RÚCULA", description: "rúcula, mussarela, tomate e parmesão" },
  { title: "SELVA", description: "palmito, ervilha, cebola e mussarela" },
  { title: "TOMATE SECO COM ALICHE", description: "tomate seco, mussarela de búfala, aliche e alcaparra" },
  { title: "TOMATE SECO COM MUSSARELA DE BÚFALA", description: "tomate seco, mussarela de búfala e rúcula" },
  { title: "TROPICAL", description: "palmito, champignon, mussarela, cebola e azeitonas" },
  { title: "VICTORIA I", description: "fundo de alcachofra, salpicada de mussarela de búfala e alho frito" },
  { title: "VICTORIA II", description: "fundo de alcachofra, mussarela de búfala, tomate seco e rúcula" },
  { title: "VEGETARIANA", description: "palmito, ervilha, cebola, ovo, catupiry e milho" },
];
const menuItems3 = [
  { title: "CAIPIRA", description: "frango, milho, cebola e catupiry" },
  { title: "FRANGO", description: "frango ao molho e cebola" },
  { title: "FRANGO I", description: "frango ao molho, cebola e mussarela" },
  { title: "FRANGO II", description: "frango ao molho, cebola e catupiry" },
  { title: "FRANGO ESPECIAL", description: "frango, champignon, palmito e provolone" },
];
const menuItems4 = [
  { title: "BACON ESPECIAL", description: "bacon, champignon, catupiry e parmesão" },
  { title: "BACON COM TOMATE SECO", description: "bacon, tomate seco, catupiry e parmesão" },
  { title: "BAIANA", description: "calabresa moída, pimenta, ovo e cebola" },
  { title: "CALABRESA", description: "calabresa fatiada e cebola" },
  { title: "CALABRESA FRITA", description: "calabresa frita coberta com catupiry ou mussarela" },
  { title: "CAMORRA", description: "calabresa frita, mussarela, manjericão e parmesão" },
  { title: "CANADENSE", description: "salame, catupiry, pimentão em rodelas e champignon" },
  { title: "CANADENSE II", description: "peperoni, catupiry, pimentão em rodelas e champignon" },
  { title: "CAPRI", description: "peito de peru, mussarela, palmito e champignon" },
  { title: "CAPRICHOSA", description: "mussarela, fatias de lombo, tomate e catupiry" },
  { title: "PROVOLONE COM BACON", description: "provolone com fatias de bacon" },
  { title: "CARNE SECA I", description: "carne seca e cebola" },
  { title: "CARNE SECA II", description: "carne seca, cebola, mussarela ou catupiry" },
  { title: "DO CHEFE II", description: "presunto, escarola, champignon, mussarela, fatias de bacon salpicadas com parmesão" },
  { title: "DO CHEFE III", description: "mussarela, calabresa em rodelas, palmito e cebolas" },
  { title: "DOM LAU", description: "peito de peru, cebola com mussarela ou catupiry" },
  { title: "FLORENTINA", description: "presunto, palmito, mussarela e manjericão" },
  { title: "FRANCESA", description: "presunto, mussarela, champignon, catupiry e parmesão" },
  { title: "FRANCESA II", description: "presunto, fatias de bacon, champignon e cebola" },
  { title: "LOMBO", description: "lombo fatiado com cebola" },
  { title: "LOMBO COM CATUPIRY", description: "lombo, catupiry e cebola" },
  { title: "LOMBO COM PROVOLONE", description: "lombo, provolone e cebola" },
  { title: "LOMBO ESPECIAL", description: "lombo, calabresa, palmito, provolone, pimentão e azeitona" },
  { title: "MAFIOSA", description: "calabresa, pimentão, cebola e mussarela" },
  { title: "MODINHA", description: "presunto, mussarela e catupiry" },
  { title: "PARMA", description: "presunto, mussarela de búfala e alcaparra" },
  { title: "PEPPERONI", description: "pepperoni, mussarela com ou sem cebola" },
  { title: "PORTUGUESA", description: "presunto, calabresa, ovos cozidos, cebola e mussarela" },
  { title: "PRESUNTO", description: "presunto fatiado e cebola" },
  { title: "PRESUNTO COM CALABRESA", description: "presunto, mussarela, calabresa frita, pimentão e azeitona" },
  { title: "SALAME", description: "salame, mussarela com ou sem cebola" },
  { title: "SALAME II", description: "salame, mussarela, pimentão e azeitonas" },
  { title: "TOSCANA", description: "calabresa moída, mussarela e pimentão" },
];

const menuItems5 = [
  { title: "ALICHE", description: "aliche da melhor qualidade" },
  { title: "ALICHE COM ALCAPARRA", description: "aliche, tomate e alcaparra" },
  { title: "AMERICANA", description: "atum sólido, palmito, ervilha, cebola e mussarela" },
  { title: "ATUM I", description: "atum da melhor qualidade e cebola" },
  { title: "ATUM II", description: "atum com catupiry" },
  { title: "ATUM COM CALABRESA", description: "atum, calabresa, catupiry e parmesão" },
  { title: "ATUM ESPECIAL", description: "atum, alcaparra, tomate e cebola" },
  { title: "ATUM SÓLIDO I", description: "atum sólido e cebola" },
  { title: "ATUM SÓLIDO II", description: "atum sólido coberto com catupiry ou mussarela" },
  { title: "BACALHAU", description: "bacalhau desfiado e cebola" },
  { title: "BACALHAU DA CASA", description: "bacalhau, ovos, rodelas de pimentão e cebola" },
  { title: "BRASILEIRA", description: "camarão, champignon, ervilha, cebola e catupiry" },
  { title: "CAMARÃO", description: "camarão ao molho e cebola" },
  { title: "CAMARÃO ESPECIAL", description: "catupiry, camarão, bacon, cebola, pimentão e azeitonas" },
  { title: "MARGARIDA", description: "aliche, escarola, presunto, ovos cozidos, mussarela e parmesão" },
  { title: "MARÍNARA", description: "camarão, bacalhau e aliche" },
  { title: "PERUANA", description: "atum, palmito, ervilha e provolone" },
  { title: "PIZZAIOLO", description: "atum, aliche, calabresa e mussarela" },
  { title: "PRIMAVERA", description: "atum, ervilha, palmito, ovos cozidos, cebola e mussarela" },
  { title: "ROMANA", description: "aliche, cebola e mussarela" },
  { title: "ROYAL I", description: "atum, ovos, cebola, rodelas de tomate e azeitona" },
  { title: "ROYAL II", description: "atum, cebola, mussarela, filé de aliche e azeitona" },
  { title: "TRÊS PEIXES", description: "camarão, atum, bacalhau e cebola" },
];
const menuItems6 = [
  { title: "BRÓCOLIS", description: "calabresa moída, brócolis, mussarela, palmito e catupiry" },
  { title: "BAIANA", description: "calabresa moída, mussarela, palmito e catupiry" },
  { title: "DOM LAU", description: "escarola, calabresa moída, tomate seco picado, catupiry e manjericão" },
  { title: "FRANGO", description: "frango, mussarela, catupiry, palmito e azeitona" },
  { title: "TROPICAL", description: "escarola, champignon, presunto, mussarela e catupiry" },
];
const menuItems7 = [
  { title: "BANANA", description: "banana, mussarela, açúcar, canela e doce de leite" },
  { title: "BANANA COM CHOCOLATE", description: "banana, chocolate e doce de leite" },
  { title: "MORANGO COM CHOCOLATE", description: "chocolate, morango e granulado" },
  { title: "NEGA MALUCA", description: "chocolate, cerejas e chocolate granulado" },
  { title: "PRESTÍGIO", description: "chocolate, cerejas, coco ralado e chocolate granulado" },
  { title: "ROMEU E JULIETA", description: "mussarela e doce de goiabada" },
];

// This page is using the craft.tsx component and design system
export default function Home() {
  return (
    <Section>
      <Container>
        {/* <ExampleJsx /> */}
        <HeroSection />
        <div className="flex flex-col gap-y-[10px]">
          <MenuSection items={menuItems} />
          <MenuSectionReversed items={menuItems2} />
          <MenuSection items={menuItems3} />
          <MenuSectionReversed items={menuItems4} />
          <MenuSection items={menuItems5} />
          <MenuSectionReversed items={menuItems6} />
          <MenuSection items={menuItems7} />
        </div>
        <ContactSection />
      </Container>
    </Section>
  );
}

// This is just some example JS to demonstrate automatic styling from brijr/craft
const ExampleJsx = () => {
  return (
    <article className="prose-m-none">
      <h1>
        <Balancer>
          Hello World, welcome to the Next.js and WordPress Starter by{" "}
          <a href="https://9d8.dev">9d8</a>.
        </Balancer>
      </h1>
      {/* Vercel Clone Starter */}
      <a
        className="h-16 block"
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME&envDescription=Add%20WordPress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%20abd%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev"
      >
        {/* eslint-disable-next-line */}
        <img
          className="not-prose my-4"
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
        />
      </a>
      <p>
        This is <a href="https://github.com/9d8dev/next-wp">next-wp</a>, created
        as a way to build WordPress sites with Next.js at rapid speed. This
        starter is designed with <a href="https://ui.shadcn.com">shadcn/ui</a>,{" "}
        <a href="https://github.com/brijr/craft">brijr/craft</a>, and Tailwind
        CSS. Use <a href="https://components.bridger.to">brijr/components</a> to
        build your site with prebuilt components. The data fetching and
        typesafety is handled in <code>lib/WordPress.ts</code> and{" "}
        <code>lib/WordPress.d.ts</code>. Questions? Email 9d8dev@gmail.com
      </p>
      <div className="grid md:grid-cols-3 gap-4 mt-6 not-prose">
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts"
        >
          <Pen size={32} />
          <span>
            Posts{" "}
            <span className="block text-sm text-muted-foreground">
              All posts from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/pages"
        >
          <File size={32} />
          <span>
            Pages{" "}
            <span className="block text-sm text-muted-foreground">
              Custom pages from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts/authors"
        >
          <User size={32} />
          <span>
            Authors{" "}
            <span className="block text-sm text-muted-foreground">
              List of the authors from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts/tags"
        >
          <Tag size={32} />
          <span>
            Tags{" "}
            <span className="block text-sm text-muted-foreground">
              Content by tags from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts/categories"
        >
          <Boxes size={32} />
          <span>
            Categories{" "}
            <span className="block text-sm text-muted-foreground">
              Categories from your WordPress
            </span>
          </span>
        </Link>
        <a
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="https://github.com/9d8dev/next-wp"
        >
          <Folder size={32} />
          <span>
            Documentation{" "}
            <span className="block text-sm text-muted-foreground">
              How to use `next-wp`
            </span>
          </span>
        </a>
      </div>
    </article>
  );
};
