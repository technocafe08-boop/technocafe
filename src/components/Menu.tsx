import { motion } from "framer-motion";
import { useMenuCategories, useMenuItems, useMenuSubCategories } from "../hooks/useMenu";
import TiltCard from "./TiltCard";

export default function Menu() {
  const categories = useMenuCategories();
  const subCategories = useMenuSubCategories();
  const items = useMenuItems();

  return (
    <section id="menu" className="relative py-24 md:py-32 px-5 md:px-10 bg-bg overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto text-center mb-14 md:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold gradient-text">
          CAFE MENU
        </h2>
        <p className="mt-3 text-white/60 font-body text-sm md:text-base">
          Fuel up between matches — snacks, quick bites, and drinks.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category, i) => {
          const categoryItems = items.filter((it) => it.categoryId === category.id);
          if (categoryItems.length === 0) return null;

          const subs = subCategories.filter((s) => s.categoryId === category.id);
          const itemsWithoutSub = categoryItems.filter((it) => !it.subCategoryId);

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            >
              <TiltCard className="rgb-border glass rounded-2xl p-6 md:p-7 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl md:text-4xl">{category.emoji}</span>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-cyan neon-cyan">
                    {category.name}
                  </h3>
                </div>

                {itemsWithoutSub.length > 0 && <MenuItemList items={itemsWithoutSub} />}

                {subs.map((sub) => {
                  const subItems = categoryItems.filter((it) => it.subCategoryId === sub.id);
                  if (subItems.length === 0) return null;
                  return (
                    <div key={sub.id} className="mt-4 first:mt-0">
                      <p className="text-purple text-xs font-heading tracking-wide mb-2">
                        {sub.name.toUpperCase()}
                      </p>
                      <MenuItemList items={subItems} />
                    </div>
                  );
                })}
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function MenuItemList({ items }: { items: { id: string; name: string; price: number }[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-baseline justify-between gap-3 font-body">
          <span className="text-white/80 text-sm md:text-base">{item.name}</span>
          <span className="shrink-0 border-b border-dotted border-white/15 flex-1 mx-1" />
          <span className="shrink-0 font-heading text-sm md:text-base text-purple">
            ₹{item.price}
          </span>
        </li>
      ))}
    </ul>
  );
}
