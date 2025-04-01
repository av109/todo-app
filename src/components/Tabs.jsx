import React, { useCallback } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const tabOptions = ["All", "Active", "Completed"];

const Tabs = React.memo(({ selectedTab, setSelectedTab }) => {
  const handleTabClick = useCallback(
    (tabName) => {
      setSelectedTab(tabName);
    },
    [setSelectedTab]
  );

  return (
    <div className="w-full px-4 my-2">
      <ul className="flex gap-2 items-center w-full">
        {tabOptions.map((tab) => (
          <motion.li
            key={tab}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={clsx(
              "flex-1 text-center rounded-md p-2 cursor-pointer transition-colors duration-200",
              {
                "bg-amber-500 text-white shadow-md": selectedTab === tab,
                "bg-amber-100 text-amber-800 hover:bg-amber-200": selectedTab !== tab,
              }
            )}
            onClick={() => handleTabClick(tab)}
            role="tab"
            aria-selected={selectedTab === tab}
          >
            {tab}
          </motion.li>
        ))}
      </ul>
    </div>
  );
});

export default Tabs;