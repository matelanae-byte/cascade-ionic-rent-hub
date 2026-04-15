const AboutSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">О нас</h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Мы помогаем подобрать оборудование для мойки фасадов и окон под конкретную задачу.
          На сайте cascade ionic можно взять решение под объект без лишних сложностей
          и без необходимости сразу вкладываться в покупку полного комплекта.
          Это удобно для новичков, клининговых компаний, частных мастеров
          и тех, кому нужно закрыть конкретный объем работ.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
