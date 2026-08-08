/* eslint-disable no-undef, no-unused-vars */
import puppeteer from 'puppeteer';

(async () => {
  console.log("Starting Error States Validation Matrix...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  let passed = 0, failed = 0;

  function assert(condition, msg) {
    if (condition) {
      console.log("✅ PASS: " + msg);
      passed++;
    } else {
      console.error("❌ FAIL: " + msg);
      failed++;
    }
  }

  page.on('console', msg => {
    if (msg.type() === 'error') {
       console.log('PAGE ERROR LOG:', msg.text(), msg.location().url);
    } else {
       console.log('PAGE LOG:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE UNCAUGHT ERROR:', error.message);
  });
  
  page.on('requestfailed', request => {
    console.log('PAGE REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  try {
    // 1. Load page
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    
    // Scenario 1: Empty form -> click submit -> should show inline errors
    console.log("Testing Scenario 1: Empty Form Validation...");
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));
    
    let fullNameError = await page.$eval('#fullNameError', el => el.textContent);
    let birthDateError = await page.$eval('#birthDateError', el => el.textContent);
    assert(fullNameError.includes("Enter your full name"), "Full Name inline error shown correctly");
    assert(birthDateError.includes("Enter your birth date"), "Date inline error shown correctly");

    // Scenario 2: Invalid Location Validation
    console.log("Testing Scenario 2: Unknown Location Validation...");
    await page.type('#fullName', 'Test Name');
    await page.type('#birthDate', '01012000');
    // Using evaluate for time to avoid formatting issues with type() on time inputs
    await page.evaluate(() => document.getElementById('birthTime').value = '12:00');
    await page.type('#birthPlace', 'Nowhereville');
    
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));
    
    let placeError = await page.$eval('#birthPlaceError', el => el.textContent);
    assert(placeError.includes("Choose a recognized birthplace"), "Unknown location error shown correctly");

    // Scenario 3: Calculation Exception Fallback
    console.log("Testing Scenario 3: Calculation Exception...");
    await page.evaluate(() => {
       document.getElementById('birthPlace').value = 'Delhi, India';
       window._originalSin = Math.sin;
       Math.sin = () => { throw new Error("Mock celestial math error"); };
    });
    
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));
    
    let errorStateVisible = await page.$eval('#globalErrorState', el => window.getComputedStyle(el).display !== 'none');
    let errorStateMsg = await page.$eval('#globalErrorMessage', el => el.textContent);
    assert(errorStateVisible, "Global error state is visible");
    assert(errorStateMsg.includes("Mock celestial math error"), "Global error safely catches exception");

    await page.evaluate(() => { Math.sin = window._originalSin; });
    await page.click('#returnBtn');
    await new Promise(r => setTimeout(r, 500));
    let formVisible = await page.$eval('#astroForm', el => window.getComputedStyle(el).display !== 'none');
    assert(formVisible, "Form restores visibility after clicking Return to Details");

    // Scenario 4: Missing Report Data Fallback
    console.log("Testing Scenario 4: Missing Report Data Fallback...");
    await page.evaluate(() => sessionStorage.clear()); // FIX: Clear session storage from Scenario 3
    await page.goto('http://localhost:5173/Astrology-app/result.html', { waitUntil: 'networkidle0' });
    let missingDataHeading = await page.$eval('main h1', el => el.textContent).catch(e => "");
    assert(missingDataHeading === "Blueprint Unavailable", "Editorial fallback shown for missing session data");

    // Scenario 5: Print Failure Catching
    console.log("Testing Scenario 5: Print Failure Catching...");
    await page.evaluate(() => {
       window.print = () => { throw new Error("Browser blocked print"); };
       
       sessionStorage.setItem('astroReport', JSON.stringify({
         fullName: "A", place: "B", day: 1, month: 1, year: 2000, 
         ascSign: {glyph:"a", name:"b", tone:"c"}, dominant: {topElement:"e", topMode:"f"},
         mulank: 1, bhagyank: 1, naamank: 1,
         planetRows: [{name:"Ketu", house:1, sign:{tone:"x"}}, {name:"Moon", sign:{tone:"y"}}], 
         asc: 0,
         moon: {sign:{tone:"x", name:"y"}}, venus:{house:1}, sun:{house:1}, mars:{house:1}, jupiter:{house:1}, saturn:{house:1}, rahu:{house:1},
       }));
    });
    
    await page.goto('http://localhost:5173/Astrology-app/result.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2500)); // wait for loader
    
    await page.evaluate(() => { window.tryPrintKeepsake(); });
    await new Promise(r => setTimeout(r, 500));
    let printErrorText = await page.$eval('#printErrorContainer span', el => el.textContent).catch(e => "");
    assert(printErrorText.includes("Unable to generate PDF/print"), "Print failure error is visible and persistent with Try Again option");

  } catch (err) {
    console.error("Test script failed unexpectedly:", err);
  } finally {
    await browser.close();
    console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed.`);
  }
})();
