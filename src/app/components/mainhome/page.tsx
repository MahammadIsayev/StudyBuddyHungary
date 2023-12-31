import { SelectedPage } from "@/app/shared/types";
import Button from "@/app/shared/button";
import { motion } from "framer-motion";
import Image from 'next/image';
import { BiWorld } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';
import { FaComments } from 'react-icons/fa'
import { PiBooksFill } from 'react-icons/pi'
import { useState } from "react";
import InstructionsModal from "@/app/modals/instructionsmodal";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const MainHome = ({ setSelectedPage }: Props) => {
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);

  const openInstructionsModal = () => {
    setIsInstructionsModalOpen(true);
  };

  const closeInstructionsModal = () => {
    setIsInstructionsModalOpen(false);
  };

  return (
    <div>
      <section id="home" className="gap-16 bg-gray-20 py-10 md:h-full md:pb-0 mt-12">
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
              <p className="mt-16 mx-4 text-md">
                Discover our diverse community of students from universities all over Hungary,
                regardless of your location. Immerse yourself in our lively environment, engage in study groups,
                contribute to discussions, and initiate meaningful dialogues with fellow students who share common interests,
                irrespective of the cities and universities they belong to.
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
              <button
                className="font-bold text-orange-400 hover:text-orange-500 underline"
                onClick={openInstructionsModal}
              >
                Get started
              </button>
              <InstructionsModal
                isOpen={isInstructionsModalOpen}
                onRequestClose={closeInstructionsModal}
              />
            </motion.div>
          </div>

          {/* IMAGE */}
          <motion.div
            className="flex basis-3/5 justify-center md:z-10 md:ml-40 md:mt-64 md:justify-items-end"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Image src="/assets/hunmap.png" alt="HunMap" width={904} height={558} />
          </motion.div>

        </motion.div>
      </section>

      {/* NEW SECTION: Key Benefits */}
      <section className="gap-16 bg-gray-20 py-10 md:h-full md:pb-0 mt-36 max-w-screen-xl mx-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 tracking-wide mb-12">
            Key Benefits
          </h2>
          <div className="flex justify-between space-x-6">

            {/* Benefit 1 */}
            <div className="flex flex-col items-center space-y-6">
              <div className="text-lg text-orange-400">
                {/* Icon 1 */}
                <BiWorld size={77} />
              </div>
              <p className="text-md">
                Connect with students from universities across Hungary.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col items-center space-y-6">
              <div className="text-lg text-orange-400">
                {/* Icon 2 */}
                <MdSchool size={77} />
              </div>
              <p className="text-md">Join or create study groups to excel in your courses.</p>
            </div>



            {/* Benefit 3 */}
            <div className="flex flex-col items-center space-y-6">
              <div className="text-md text-orange-400">
                {/* Icon 3 */}
                <PiBooksFill size={77} />
              </div>
              <p className="text-md"> Engage in discussions and share academic resources.</p>
            </div>
            {/* Benefit 4 */}
            <div className="flex flex-col items-center space-y-6">
              <div className="text-md text-orange-400">
                {/* Icon 4 */}
                <FaComments size={77} />
              </div>
              <p className="text-md">Find like-minded peers from various cities and universities.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default MainHome;
