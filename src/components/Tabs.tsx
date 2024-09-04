"use client";
import React from "react";
interface ICustomTabsProps {
  items: {
    key: string;
    label: string;
    children: React.ReactNode;
  }[];
  active?: string;
  onChangeTabs: (selected: string) => void;
}

const CustomTabs = ({ active, items, onChangeTabs }: ICustomTabsProps) => {
  const [selected, setSelected] = React.useState<string>(
    active || items[0].key
  );

  const header = items.map((item) => ({
    label: item.label,
    key: item.key,
  }));

  const content = items.find((item) => item.key === selected)?.children;

  React.useEffect(() => {
    if (active) {
      setSelected(active);
    }
  }, [active]);

  return (
    <div>
      <header className="-mb-[1px] flex gap-1">
        {header.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setSelected(item.key);
              onChangeTabs(item.key);
            }}
            className={`${
              selected === item.key
                ? "border-b-white bg-white font-bold text-[#1A4381]"
                : "text-[#8A93A7]"
            } rounded-lg rounded-b-none border border-[#E3E3E3] px-[44px] py-4 text-[14px] leading-[22px]`}
          >
            {item.label}
          </button>
        ))}
      </header>
      <main className="w-full rounded-lg rounded-tl-none border border-[#E3E3E3] bg-white px-[44px] py-9">
        {content}
      </main>
    </div>
  );
};

export default CustomTabs;
