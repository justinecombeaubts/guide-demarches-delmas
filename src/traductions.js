/*
 * Traductions du document remis à la famille (arabe, turc, portugais).
 * Textes FIXES, préparés une fois pour toutes, jamais générés pendant l'entretien.
 * ⚠ Prototype : brouillons de traduction à faire valider par un relecteur natif avant toute mise en service.
 */
(function (global) {
  "use strict";

  const LANGUES = {
    ar: { nom: "العربية", nomFr: "arabe", dir: "rtl", locale: "ar" },
    tr: { nom: "Türkçe", nomFr: "turc", dir: "ltr", locale: "tr-TR" },
    pt: { nom: "Português", nomFr: "portugais", dir: "ltr", locale: "pt-PT" },
  };

  // Pour chaque démarche : [titre, détail]. Les détails variables (CAF, assurances, notaire) ont une version générale.
  const DEMARCHES = {
    "acte-deces": {
      ar: ["التصريح بالوفاة والحصول على شهادة الوفاة", "اطلبوا عدة نسخ من شهادة الوفاة، فستُطلب منكم في معظم الإجراءات."],
      tr: ["Ölümü bildirmek ve ölüm belgesini almak", "Ölüm belgesinden birkaç kopya isteyin: işlemlerin çoğunda sizden istenecektir."],
      pt: ["Declarar o óbito e obter a certidão de óbito", "Peça várias cópias da certidão de óbito: serão pedidas na maioria dos procedimentos."],
    },
    consulat: {
      ar: ["تسجيل الوفاة في السجل المدني الفرنسي", "بعد التصريح لدى سلطات البلد، تقوم القنصلية بتسجيل شهادة الوفاة. اطلبوا عدة نسخ منها."],
      tr: ["Ölümü Fransız nüfus kayıtlarına işletmek", "Ülkedeki makamlara bildirimden sonra konsolosluk ölüm belgesini kayda geçirir. Birkaç kopya isteyin."],
      pt: ["Transcrever o óbito no registo civil francês", "Depois da declaração às autoridades do país, o consulado transcreve a certidão de óbito. Peça várias cópias."],
    },
    employeur: {
      ar: ["إبلاغ صاحب العمل", "تكفي مكالمة هاتفية أو رسالة، مع نسخة من شهادة الوفاة."],
      tr: ["İşvereni bilgilendirmek", "Ölüm belgesinin bir kopyasıyla birlikte bir telefon veya bir mektup yeterlidir."],
      pt: ["Avisar o empregador", "Basta um telefonema ou uma carta, com uma cópia da certidão de óbito."],
    },
    administration: {
      ar: ["إبلاغ الإدارة المشغِّلة", "مكالمة أو رسالة إلى مصلحة الموارد البشرية، مع نسخة من شهادة الوفاة."],
      tr: ["Çalıştığı kamu kurumunu bilgilendirmek", "Ölüm belgesinin bir kopyasıyla insan kaynakları birimine bir telefon veya mektup."],
      pt: ["Avisar a administração empregadora", "Um telefonema ou uma carta aos recursos humanos, com uma cópia da certidão de óbito."],
    },
    "france-travail": {
      ar: ["إبلاغ France Travail (هيئة التشغيل)", "لإنهاء التسجيل وصرف الإعانات."],
      tr: ["France Travail'i (iş kurumu) bilgilendirmek", "Kaydı ve ödeneklerin ödenmesini sonlandırmak için."],
      pt: ["Informar a France Travail (serviço de emprego)", "Para terminar a inscrição e o pagamento dos subsídios."],
    },
    urssaf: {
      ar: ["إبلاغ URSSAF", "للتصريح بانتهاء النشاط المستقل."],
      tr: ["URSSAF'ı bilgilendirmek", "Serbest çalışma faaliyetinin sona erdiğini bildirmek için."],
      pt: ["Informar a URSSAF", "Para declarar o fim da atividade independente."],
    },
    banques: {
      ar: ["إبلاغ البنوك", "أبلغوا كل بنك كان للشخص فيه حساب، مع نسخة من شهادة الوفاة."],
      tr: ["Bankaları bilgilendirmek", "Kişinin hesabı olan her bankayı ölüm belgesinin bir kopyasıyla bilgilendirin."],
      pt: ["Informar os bancos", "Avise cada banco onde a pessoa tinha conta, com uma cópia da certidão de óbito."],
    },
    cpam: {
      ar: ["إبلاغ التأمين الصحي (CPAM)", "حسب الحالة، يمكن صرف منحة وفاة للأقارب."],
      tr: ["Sağlık sigortasını (CPAM) bilgilendirmek", "Duruma göre yakınlara bir ölüm yardımı ödenebilir."],
      pt: ["Informar o Seguro de Saúde (CPAM)", "Consoante a situação, pode ser pago um subsídio por morte aos familiares."],
    },
    caf: {
      ar: ["إبلاغ CAF أو MSA", "بخصوص الأطفال القاصرين المُعالين أو الإعانات التي كانت تُصرف للشخص."],
      tr: ["CAF veya MSA'yı bilgilendirmek", "Bakmakla yükümlü olunan reşit olmayan çocuklar veya kişiye ödenen yardımlar için."],
      pt: ["Informar a CAF ou a MSA", "Para os filhos menores a cargo ou os apoios pagos à pessoa."],
    },
    invalidite: {
      ar: ["إبلاغ الجهة التي تصرف معاش العجز", "لإيقاف صرف المعاش."],
      tr: ["Malullük aylığını ödeyen kurumu bilgilendirmek", "Aylığın ödenmesini sonlandırmak için."],
      pt: ["Informar a entidade que paga a pensão de invalidez", "Para terminar o pagamento da pensão."],
    },
    assurances: {
      ar: ["إبلاغ شركات التأمين", "يجب تحديد المستفيدين من العقود."],
      tr: ["Sigorta şirketlerini bilgilendirmek", "Sözleşmelerin lehtarlarının belirlenmesi gerekir."],
      pt: ["Avisar as seguradoras", "É preciso identificar os beneficiários dos contratos."],
    },
    "assurance-emprunteur": {
      ar: ["إبلاغ تأمين القرض", "بالنسبة للقروض الجارية: يمكن للتأمين أن يتحمل كل المبلغ المتبقي أو جزءًا منه."],
      tr: ["Kredi sigortasını bilgilendirmek", "Devam eden krediler için: sigorta kalan borcun tamamını veya bir kısmını karşılayabilir."],
      pt: ["Avisar o seguro do crédito", "Para os créditos em curso: o seguro pode assumir a totalidade ou parte do capital em dívida."],
    },
    bailleur: {
      ar: ["إبلاغ المؤجِّر وفسخ عقد الإيجار", "برسالة، مع نسخة من شهادة الوفاة."],
      tr: ["Ev sahibini bilgilendirmek ve kira sözleşmesini feshetmek", "Ölüm belgesinin bir kopyasıyla birlikte mektupla."],
      pt: ["Avisar o senhorio e rescindir o contrato de arrendamento", "Por carta, com uma cópia da certidão de óbito."],
    },
    "assurance-habitation": {
      ar: ["إبلاغ تأمين السكن", "لنقل العقد أو فسخه."],
      tr: ["Konut sigortasını bilgilendirmek", "Sözleşmeyi devretmek veya feshetmek için."],
      pt: ["Avisar o seguro da habitação", "Para transferir ou rescindir o contrato."],
    },
    contrats: {
      ar: ["فسخ العقود أو نقلها", "الكهرباء والغاز والماء والهاتف والإنترنت والاشتراكات باسم الشخص."],
      tr: ["Sözleşmeleri feshetmek veya devretmek", "Kişi adına olan enerji, su, telefon, internet ve abonelikler."],
      pt: ["Rescindir ou transferir os contratos", "Energia, água, telefone, internet e assinaturas em nome da pessoa."],
    },
    "assurance-auto": {
      ar: ["إبلاغ تأمين السيارة", "لنقل العقد أو فسخه."],
      tr: ["Araç sigortasını bilgilendirmek", "Sözleşmeyi devretmek veya feshetmek için."],
      pt: ["Avisar o seguro automóvel", "Para transferir ou rescindir o contrato."],
    },
    "caisses-retraite": {
      ar: ["إبلاغ صناديق التقاعد", "أبلغوا كل صندوق كان يصرف معاشًا، الأساسي والتكميلي."],
      tr: ["Emeklilik kurumlarını bilgilendirmek", "Temel ve tamamlayıcı emekli aylığı ödeyen her kurumu bilgilendirin."],
      pt: ["Informar as caixas de reforma", "Avise cada caixa que pagava uma pensão, de base e complementar."],
    },
    mutuelle: {
      ar: ["إبلاغ التأمين الصحي التكميلي (mutuelle)", "مع نسخة من شهادة الوفاة."],
      tr: ["Tamamlayıcı sağlık sigortasını (mutuelle) bilgilendirmek", "Ölüm belgesinin bir kopyasıyla."],
      pt: ["Informar o seguro de saúde complementar (mutuelle)", "Com uma cópia da certidão de óbito."],
    },
    "carte-grise": {
      ar: ["تحديث وثيقة تسجيل المركبة (carte grise)", "يجب نقل الوثيقة باسم أحد الورثة، أو التنازل عن المركبة."],
      tr: ["Araç ruhsatını güncellemek", "Ruhsat bir mirasçı adına geçirilmeli ya da araç devredilmelidir."],
      pt: ["Atualizar o documento do veículo (carte grise)", "O documento deve passar para o nome de um herdeiro, ou o veículo ser cedido."],
    },
    notaire: {
      ar: ["التواصل مع موثِّق (notaire)", "يرافقكم الموثِّق في إجراءات الإرث. وهو إلزامي إذا كان الشخص يملك عقارًا."],
      tr: ["Bir noterle iletişime geçmek", "Noter miras işlemlerinde size eşlik eder. Kişinin bir gayrimenkulü varsa zorunludur."],
      pt: ["Contactar um notário", "O notário acompanha-o na sucessão. É obrigatório se a pessoa tinha um imóvel."],
    },
    impots: {
      ar: ["تقديم آخر تصريح بدخل الشخص", "يشمل المداخيل المحصّلة حتى تاريخ الوفاة."],
      tr: ["Kişinin son gelir beyannamesini vermek", "Ölüm tarihine kadar elde edilen gelirleri kapsar."],
      pt: ["Fazer a última declaração de rendimentos da pessoa", "Abrange os rendimentos recebidos até à data do óbito."],
    },
    "declaration-conjoint": {
      ar: ["تكييف التصريح الضريبي للأسرة", "في سنة الوفاة، يخضع تصريح الزوج أو شريك PACS لقواعد خاصة: يمكن لمركز المالية العامة مساعدتكم."],
      tr: ["Hane beyannamesini uyarlamak", "Ölüm yılında eşin veya PACS partnerinin beyannamesi özel kurallara tabidir: vergi dairesi size yardımcı olabilir."],
      pt: ["Adaptar a declaração do agregado familiar", "No ano do óbito, a declaração do cônjuge ou do parceiro de PACS segue regras especiais: o centro de finanças públicas pode ajudá-lo."],
    },
    reversion: {
      ar: ["طلب معاش الزوج الباقي على قيد الحياة (pension de réversion)", "مخصص للزوج أو الزوجة المتزوجين. يُستحسن تقديم الطلب بسرعة."],
      tr: ["Dul aylığı (pension de réversion) talep etmek", "Evli eşe ayrılmıştır. Başvurunun hızlıca yapılması önerilir."],
      pt: ["Pedir a pensão de sobrevivência", "Está reservada ao cônjuge casado. É melhor fazer o pedido rapidamente."],
    },
    "livret-famille": {
      ar: ["تحديث دفتر العائلة", "تُضاف إليه إشارة الوفاة."],
      tr: ["Aile cüzdanını güncellemek", "Ölüm kaydı cüzdana eklenir."],
      pt: ["Atualizar o livro de família", "É acrescentada a menção do óbito."],
    },
    "comptes-en-ligne": {
      ar: ["إغلاق الحسابات الإلكترونية أو نقلها", "البريد الإلكتروني وشبكات التواصل الاجتماعي والحسابات الإلكترونية للشخص."],
      tr: ["Çevrim içi hesapları kapatmak veya devretmek", "Kişinin e-postası, sosyal medya ve çevrim içi hesapları."],
      pt: ["Encerrar ou transmitir as contas online", "E-mail, redes sociais e contas online da pessoa."],
    },
    "juge-tutelles": {
      ar: ["التحقق مما إذا كان يجب تدخل قاضي الوصاية", "في بعض الحالات فقط، عندما يرث طفل قاصر: سيخبركم الموثِّق أو مستشاركم بذلك."],
      tr: ["Vesayet hâkiminin devreye girmesi gerekip gerekmediğini kontrol etmek", "Yalnızca bazı durumlarda, reşit olmayan bir çocuk mirasçı olduğunda: noter veya danışmanınız size bildirecektir."],
      pt: ["Verificar se o juiz de tutelas deve intervir", "Só em certos casos, quando um filho menor é herdeiro: o notário ou o seu conselheiro dir-lho-á."],
    },
  };

  const DELAIS = {
    "24h":       { ar: "خلال 24 ساعة",              tr: "24 saat içinde",                     pt: "Nas 24 horas" },
    "48h":       { ar: "خلال 48 ساعة",              tr: "48 saat içinde",                     pt: "Nas 48 horas" },
    vite:        { ar: "في أقرب وقت ممكن",          tr: "En kısa sürede",                     pt: "Assim que possível" },
    "30j":       { ar: "خلال 30 يومًا",             tr: "30 gün içinde",                      pt: "Nos 30 dias" },
    "3m":        { ar: "خلال 3 أشهر",               tr: "3 ay içinde",                        pt: "Nos 3 meses" },
    "6m":        { ar: "خلال 6 أشهر",               tr: "6 ay içinde",                        pt: "Nos 6 meses" },
    declaration: { ar: "عند التصريح القادم بالدخل", tr: "Bir sonraki gelir beyannamesinde",   pt: "Na próxima declaração de rendimentos" },
    libre:       { ar: "بدون أجل محدد",             tr: "Belirli bir süre yok",               pt: "Sem prazo definido" },
    besoin:      { ar: "عند الحاجة فقط",            tr: "Yalnızca gerekirse",                 pt: "Apenas se necessário" },
  };

  // Phrases du document. n = nom de la personne décédée (déjà échappé), t = téléphone (déjà échappé).
  const DOCUMENT = {
    ar: {
      titre: "الإجراءات القادمة",
      remis: (d) => `سُلّمت بتاريخ ${d}`,
      avant: (d) => `قبل ${d}`,
      intro: (n) => `تجمع هذه الوثيقة الإجراءات الواجب القيام بها${n ? ` بعد وفاة ${n}` : ""}، مرتبةً حسب آجالها. لستم مضطرين للقيام بكل شيء اليوم: يمكنكم التقدم خطوة بخطوة، ووضع علامة على كل إجراء بعد إنجازه.`,
      contact: (t) => `لأي سؤال أو استفسار، نحن في خدمتكم${t ? ` على الرقم <bdi dir="ltr">${t}</bdi>` : ""}.`,
      note: "هذه الوثيقة مرجع أُعدّ مع مستشاركم، ولا تغني عن رأي الموثِّق أو الجهات المعنية.",
    },
    tr: {
      titre: "Yapılacak işlemler",
      remis: (d) => `Teslim tarihi: ${d}`,
      avant: (d) => `${d} tarihinden önce`,
      intro: (n) => `Bu belge${n ? `, ${n} adlı kişinin vefatının ardından` : ""} yapılması gereken işlemleri sürelerine göre sıralanmış olarak bir araya getirir. Bugün her şeyi yapmak zorunda değilsiniz: adım adım ilerleyebilir ve her işlemi tamamladığınızda işaretleyebilirsiniz.`,
      contact: (t) => `Bir sorunuz mu var? ${t ? `<strong>${t}</strong> numarasından ` : ""}size her zaman yardımcı olmaya hazırız.`,
      note: "Bu belge danışmanınızla birlikte hazırlanmış bir yol göstericidir; noterin veya ilgili kurumların görüşünün yerini tutmaz.",
    },
    pt: {
      titre: "Os procedimentos a seguir",
      remis: (d) => `Entregue a ${d}`,
      avant: (d) => `antes de ${d}`,
      intro: (n) => `Este documento reúne os procedimentos a realizar${n ? ` na sequência do falecimento de ${n}` : ""}, ordenados pelos seus prazos. Não precisa de fazer tudo hoje: pode avançar passo a passo e assinalar cada procedimento quando estiver feito.`,
      contact: (t) => `Uma dúvida, uma pergunta? Estamos ao seu dispor${t ? ` pelo <strong>${t}</strong>` : ""}.`,
      note: "Este documento é uma referência preparada com o seu conselheiro; não substitui o parecer de um notário ou das entidades em causa.",
    },
  };

  const api = { LANGUES, DEMARCHES, DELAIS, DOCUMENT };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.TRADUCTIONS = api;
})(typeof window !== "undefined" ? window : globalThis);
