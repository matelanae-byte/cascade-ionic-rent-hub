import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-3xl prose prose-sm prose-neutral">
            <h1 className="text-3xl font-bold text-foreground mb-8">Политика конфиденциальности</h1>

            <p className="text-muted-foreground leading-relaxed">
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта cascade ionic.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Сбор информации</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы собираем информацию, которую вы предоставляете при заполнении форм на сайте: имя, номер телефона, город. Данные используются исключительно для обработки вашей заявки и связи с вами.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Использование информации</h2>
            <p className="text-muted-foreground leading-relaxed">
              Персональные данные используются для: обработки заявок на аренду, связи с клиентами, улучшения качества обслуживания.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Защита информации</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Передача третьим лицам</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Контакты</h2>
            <p className="text-muted-foreground leading-relaxed">
              По вопросам, связанным с обработкой персональных данных, вы можете связаться с нами по электронной почте: info@cascadeionic.ru
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
