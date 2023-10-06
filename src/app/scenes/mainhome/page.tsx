import { SelectedPage } from "@/app/shared/types";
import Button from "@/app/shared/button";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { motion } from "framer-motion";
import Image from 'next/image';

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const MainHome = ({ setSelectedPage }: Props) => {

  return (
    <section id="home" className="gap-16 bg-gray-20 py-10 md:h-full md:pb-0">
      {/* IMAGE AND MAIN HEADER */}
      <motion.div
        className="mx-auto w-5/6 items-center justify-center md:flex md:h-5/6"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
      >
        {/* MAIN HEADER */}
        <div className="z-10 mt-32 md:basis-3/5 mx-4">
          {/* HEADINGS */}
          <motion.div
            className="md:-mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >

            <p className="mt-16 mx-4 text-lg">
              Excel with students from universities across Hungary, no matter where you are. Explore our vibrant community, join study groups, participate in discussions,
              and start meaningful conversations with like-minded peers from various cities and universities.
            </p>
          </motion.div>

          {/* ACTIONS */}
          <motion.div
            className="mt-8 mx-4 flex items-center gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Button setSelectedPage={setSelectedPage}>
              Find your Study Partner
            </Button>
            <AnchorLink
              className="font-bold text-orange-400 hover:text-orange-500 underline"
              onClick={() => setSelectedPage(SelectedPage.Community)}
              href={`#${SelectedPage.Community}`}
            >
              <p>Learn More</p>
            </AnchorLink>
          </motion.div>
        </div>

        {/* IMAGE */}
        <div
          className="flex basis-3/5 justify-center md:z-10
              md:ml-40 md:mt-64 md:justify-items-end"
        >
          <Image src="/assets/hunmap.png" alt="HunMap" width={904} height={558} />
        </div>
      </motion.div>
    </section>
  );
};

export default MainHome;