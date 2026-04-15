import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Offer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-3xl prose prose-sm prose-neutral">
            <h1 className="text-3xl font-bold text-foreground mb-8">Публичная оферта</h1>

            <p className="text-muted-foreground leading-relaxed">
              Настоящий документ является официальным предложением (публичной офертой) cascade ionic о заключении договора аренды оборудования на изложенных ниже условиях.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Общие положения</h2>
            <p className="text-muted-foreground leading-relaxed">
              Настоящая оферта определяет условия аренды профессионального оборудования для мойки фасадов и окон, предоставляемого cascade ionic.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Предмет договора</h2>
            <p className="text-muted-foreground leading-relaxed">
              Арендодатель предоставляет Арендатору во временное пользование оборудование согласно каталогу, размещённому на сайте, а Арендатор обязуется принять оборудование и оплатить аренду в установленные сроки.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Порядок оформления</h2>
            <p className="text-muted-foreground leading-relaxed">
              Заявка на аренду оформляется через форму на сайте или по телефону. Акцептом оферты является оплата аренды.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Стоимость и оплата</h2>
            <p className="text-muted-foreground leading-relaxed">
              Стоимость аренды определяется действующим прейскурантом на сайте. Оплата производится в рублях безналичным переводом.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Ответственность сторон</h2>
            <p className="text-muted-foreground leading-relaxed">
              Арендатор несёт ответственность за сохранность арендованного оборудования. В случае повреждения или утраты Арендатор возмещает стоимость ремонта или замены.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Контакты</h2>
            <p className="text-muted-foreground leading-relaxed">
              cascade ionic<br />
              Электронная почта: info@cascadeionic.ru<br />
              Телефон: +7 (800) 123-45-67
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Offer;
