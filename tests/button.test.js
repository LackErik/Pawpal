const puppeteer = require("puppeteer");
const app = require("../app");

describe("Button Test", () => {
  let browser;
  let page;

  beforeAll(async () => {
    app.start();
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto("http://localhost:3000"); // Hier die URL der HTML-Seite einfügen
  }, 30000);

  afterAll(async () => {
    await browser.close();
    app.close();
  });

  it('sollte den "Quiz starten" Button überprüfen und zur ersten Frage weiterleiten', async () => {
    await page.waitForSelector(".button.button1"); // Warten, bis der "Quiz starten" Button geladen ist

    // Überprüfen Sie den Text des Buttons
    const buttonText = await page.evaluate(() => {
      const button = document.querySelector(".button.button1");
      return button.textContent;
    });
    expect(buttonText).toBe("Quiz starten");

    // Simulieren Sie einen Klick auf den "Quiz starten" Button
    await page.evaluate(() => {
      const button = document.querySelector(".button.button1");
      button.click();
    });

    // Überprüfen Sie, ob die Seite zur ersten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question1");
  });

  it("sollte den Initialzustand der Frage überprüfen", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    const questionBlock = await page.$(".question_block");

    // Überprüfen Sie den Inhalt der Frage
    const questionText = await questionBlock.$eval(
      "#question_Text",
      (element) => element.textContent.trim()
    );
    expect(questionText).toBe("Wie groß soll dein Hund sein?");

    // Überprüfen Sie den Zustand der Bilder
    const images = await questionBlock.$$(".pictures_block img");
    expect(images.length).toBe(2);

    // Überprüfen Sie den Zustand der Buttons
    const buttons = await questionBlock.$$(".button-bar button");
    expect(buttons.length).toBe(3);

    // Überprüfen Sie den Zustand des "Next" Buttons
    const nextButton = await questionBlock.$("#button_nextquestion");
    const nextButtonStyle = await nextButton.evaluate(
      (button) => button.style.display
    );
    expect(nextButtonStyle).toBe("none"); // Stellen Sie sicher, dass der "Next" Button initial ausgeblendet ist
  });

  it("sollte den initialen Zustand der Button-Bar überprüfen", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis der Frageblock geladen ist

    // Überprüfen Sie den Initialzustand der Button-Bar
    const buttonBar = await page.$(".button-bar");
    const buttons = await buttonBar.$$("button");

    // Überprüfen Sie die Anzahl der Buttons
    expect(buttons.length).toBe(3);

    // Überprüfen Sie den Zustand jedes Buttons
    for (let i = 0; i < buttons.length; i++) {
      const isActive = await buttons[i].evaluate((button) =>
        button.classList.contains("active")
      );
      expect(isActive).toBe(false);
    }

    // Klicken Sie auf den ersten Button in der Button-Bar
    await buttons[0].click();

    // Überprüfen Sie, ob der erste Button aktiv ist
    const isActive = await buttons[0].evaluate((button) =>
      button.classList.contains("active")
    );
    expect(isActive).toBe(true);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zur nächsten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question2");
  });

  it("sollte die Auswahl der Bilder überprüfen und zur nächsten Frage weiterleiten", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    // Simulieren Sie einen Klick auf das erste Bild
    const firstImage = await page.$("#button1");
    await firstImage.click();

    // Überprüfen Sie den ausgewählten Zustand des ersten Bildes
    const firstImageActive = await firstImage.evaluate((img) =>
      img.classList.contains("active")
    );
    expect(firstImageActive).toBe(true);

    // Simulieren Sie einen Klick auf das zweite Bild
    const secondImage = await page.$("#button2");
    await secondImage.click();

    // Überprüfen Sie den ausgewählten Zustand des zweiten Bildes
    const secondImageActive = await secondImage.evaluate((img) =>
      img.classList.contains("active")
    );
    expect(secondImageActive).toBe(true);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zur nächsten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question3");
  });

  it("sollte die Button-Bar überprüfen und zur nächsten Frage weiterleiten", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    // Überprüfen Sie den Initialzustand der Button-Bar
    const buttons = await page.$$(".button-bar button");

    // Überprüfen Sie die Anzahl der Buttons
    expect(buttons.length).toBe(4);

    // Simulieren Sie einen Klick auf den ersten Button
    await buttons[0].click();

    // Überprüfen Sie den geänderten Zustand der Button-Bar nach dem Klick
    const isActive1 = await buttons[0].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive2 = await buttons[1].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive3 = await buttons[2].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive4 = await buttons[3].evaluate((button) =>
      button.classList.contains("active")
    );
    expect(isActive1).toBe(true);
    expect(isActive2).toBe(false);
    expect(isActive3).toBe(false);
    expect(isActive4).toBe(false);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zur nächsten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question4");
  });

  it("sollte die Bilder in Frage 4 überprüfen und zur nächsten Frage weiterleiten", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    // Überprüfen Sie den Initialzustand der Bilder
    const images = await page.$$(".pictures_block img");

    // Überprüfen Sie die Anzahl der Bilder
    expect(images.length).toBe(2);

    // Simulieren Sie einen Klick auf das erste Bild
    await images[0].click();

    // Überprüfen Sie den geänderten Zustand der Bilder nach dem Klick
    const isActive1 = await images[0].evaluate((image) =>
      image.parentNode.classList.contains("active")
    );
    const isActive2 = await images[1].evaluate((image) =>
      image.parentNode.classList.contains("active")
    );
    expect(isActive1).toBe(true);
    expect(isActive2).toBe(false);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zur nächsten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question5");
  });

  it("sollte die Button-Bar in Frage 5 überprüfen und zur nächsten Frage weiterleiten", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    // Überprüfen Sie den Initialzustand der Button-Bar
    const buttons = await page.$$(".button-bar button");

    // Überprüfen Sie die Anzahl der Buttons
    expect(buttons.length).toBe(4);

    // Simulieren Sie einen Klick auf den ersten Button
    await buttons[0].click();

    // Überprüfen Sie den geänderten Zustand der Button-Bar nach dem Klick
    const isActive1 = await buttons[0].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive2 = await buttons[1].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive3 = await buttons[2].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive4 = await buttons[3].evaluate((button) =>
      button.classList.contains("active")
    );
    expect(isActive1).toBe(false);
    expect(isActive2).toBe(false);
    expect(isActive3).toBe(false);
    expect(isActive4).toBe(false);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zur nächsten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question6");
  });

  it("sollte die Button-Bar in Frage 6 überprüfen und zur nächsten Frage weiterleiten", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    // Überprüfen Sie den Initialzustand der Button-Bar
    const buttons = await page.$$(".button-bar button");

    // Überprüfen Sie die Anzahl der Buttons
    expect(buttons.length).toBe(3);

    // Simulieren Sie einen Klick auf den ersten Button
    await buttons[0].click();

    // Überprüfen Sie den geänderten Zustand der Button-Bar nach dem Klick
    const isActive1 = await buttons[0].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive2 = await buttons[1].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive3 = await buttons[2].evaluate((button) =>
      button.classList.contains("active")
    );
    expect(isActive1).toBe(true);
    expect(isActive2).toBe(false);
    expect(isActive3).toBe(false);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zur nächsten Frage weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/question7");
  });

  it("sollte die Button-Bar in Frage 7 überprüfen und zum Ergebnis weiterleiten", async () => {
    await page.waitForSelector(".question_block"); // Warten, bis die Frage geladen ist

    // Überprüfen Sie den Initialzustand der Button-Bar
    const buttons = await page.$$(".button-bar button");

    // Überprüfen Sie die Anzahl der Buttons
    expect(buttons.length).toBe(3);

    // Simulieren Sie einen Klick auf den ersten Button
    await buttons[0].click();

    // Überprüfen Sie den geänderten Zustand der Button-Bar nach dem Klick
    const isActive1 = await buttons[0].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive2 = await buttons[1].evaluate((button) =>
      button.classList.contains("active")
    );
    const isActive3 = await buttons[2].evaluate((button) =>
      button.classList.contains("active")
    );
    expect(isActive1).toBe(true);
    expect(isActive2).toBe(false);
    expect(isActive3).toBe(false);

    // Lösen Sie das onclick-Event des "Weiterleitungsbuttons" aus
    await page.evaluate(() => {
      const nextButton = document.getElementById("button_nextquestion");
      nextButton.style.display = "block";
      nextButton.onclick();
    });

    // Überprüfen Sie, ob die Seite zum Ergebnis weitergeleitet wurde
    await page.waitForNavigation();
    const newURL = page.url();
    expect(newURL).toBe("http://localhost:3000/result");
  });

  it('sollte den "Go Back"-Button auf jeder Seite überprüfen', async () => {
    // Seite 1
    await page.goto("http://localhost:3000/question2");
    await page.waitForSelector("#back_btn");
    const backButton1 = await page.$("#back_btn");
    await backButton1.click();
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/question1");

    // Seite 2
    await page.goto("http://localhost:3000/question3");
    await page.waitForSelector("#back_btn");
    const backButton2 = await page.$("#back_btn");
    await backButton2.click();
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/question2");

    // Seite 3
    await page.goto("http://localhost:3000/question4");
    await page.waitForSelector("#back_btn");
    const backButton3 = await page.$("#back_btn");
    await backButton3.click();
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/question3");

    // Seite 4
    await page.goto("http://localhost:3000/question5");
    await page.waitForSelector("#back_btn");
    const backButton4 = await page.$("#back_btn");
    await backButton4.click();
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/question4");

    // Seite 5
    await page.goto("http://localhost:3000/question6");
    await page.waitForSelector("#back_btn");
    const backButton5 = await page.$("#back_btn");
    await backButton5.click();
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/question5");

    // Seite 6
    await page.goto("http://localhost:3000/question7");
    await page.waitForSelector("#back_btn");
    const backButton6 = await page.$("#back_btn");
    await backButton6.click();
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/question6");
  });

  it("sollte den Impressums Button Testen und zum Impressum weiterleiten", async () => {
    await page.waitForSelector("#impressum_btn"); // Hier den Selektor des "Impressum" Links angeben

    const impressumLink = await page.$("#impressum_btn");
    await impressumLink.click();

    await page.waitForNavigation({ timeout: 10000 });

    const url = await page.url();
    expect(url).toBe("http://localhost:3000/impressum"); // Hier die erwartete Weiterleitungs-URL zur Impressum-Seite einfügen
  });
});
