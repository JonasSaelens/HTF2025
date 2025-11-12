import { test, expect, Page } from '@playwright/test';
test.setTimeout(90000);

async function startGame(page: Page) {
  //await page.goto('https://hackthefuture.bignited.be/home');

  //Klik startknop
  //await page.getByRole('button', { name: /Start/i }).click();  

  //Klik op female
  await page.goto('https://hackthefuture.bignited.be/char-select');
  await page.locator("#female").click();

  //klik op yes
  await page.getByRole('button', { name: /Yes/i }).click();

  //type inputs
  await page.getByPlaceholder('Enter your name').fill('Mizu');
  await page.getByPlaceholder('Enter your age').fill('20');
  await page.selectOption("select.form-control", { value: "Belgium" });
  
  //klik op start
  await page.getByRole('button', { name: /Start Game/i }).click();

}

async function office(page: Page) {
  // ----- PAGE 1 -----
  await page.locator('#letters').click();
  await page.click('span.close');
  await page.waitForTimeout(8500);
  await page.locator('xpath=//div[@id="crystal"]').click();
  await page.locator('div#image-crystal').click();
}

async function dockingBay(page: Page) {
  for (let i = 0; i < 5; i++) {
    if (await page.locator(`#randomValue-${i}`).innerText() === '0') {
      await page.locator(`#switch-${i}`).click();
    }
      await page.locator(`#switch-${i}`).click();
  }
  
  await page.getByRole('button', { name: /DROP/i }).click();
  await page.locator(`#submarine`).click();
}

async function submarine(page: Page) {
  while (await page.locator('.arrow').isVisible()) {
    if ((await page.locator(`.arrow`).getAttribute('src'))?.includes('up.png')) {
      await page.keyboard.press('ArrowUp');
    } else if ((await page.locator('.arrow').getAttribute('src'))?.includes('down.png')) {
      await page.keyboard.press('ArrowDown');
    } else if ((await page.locator('.arrow').getAttribute('src'))?.includes('left.png')) {
      await page.keyboard.press('ArrowLeft');
    } else if ((await page.locator('.arrow').getAttribute('src'))?.includes('right.png')) {
      await page.keyboard.press('ArrowRight');
    }
    await page.waitForTimeout(250);
  }
}

async function crash1(page: Page) {
  await page.hover('.square');
  await page.locator('.square').dblclick();
}

async function crash2(page: Page) {
  for (let i = 0; i < 4; i++) {
    await page.hover(`#square-${i}`);
    if ((await page.locator(`#crystal`).getAttribute('class'))?.includes('glowing')) {
      await page.locator(`#square-${i}`).dblclick();
    }
  }
}

async function escape(page: Page) {
  await page.waitForURL('**/cave', { timeout: 15000 });
  const slots = await page.$$('.target-slot');
  for (const slot of slots) {
    const letters = await page.$$('#draggable-cubes-container .draggable-cube');
    for (const letter of letters) {
      if (await slot.getAttribute('data-letter') === await letter.getAttribute('data-letter')) {
        await letter.hover();
        await page.mouse.down();
        await slot.hover();
        await page.mouse.up();
        break;
      }
    }
  }
}

async function cave(page: Page) {
  await page.locator('.crystal-outside').hover();
  await page.locator('#crystal').click();
  await page.locator(`.crystal-outside`).click();
  await page.locator(`.crystal-inside`).hover();
  await page.mouse.down();
  await page.waitForFunction(() => {
    const bar = document.querySelector<HTMLElement>('.loading-bar');
    return !!bar && bar.style.width === '120%';
  }, { timeout: 2000 });
  await page.mouse.up();
}

async function boss(page: Page) {
  await page.waitForURL('**/boss', { timeout: 15000 });

  while (true) {
    // Check if there's a boss bullet
    const bulletExists = await page.$('.bullet.boss');

    const { bossLeft, playerLeft } = await page.evaluate(() => {
      const boss = document.querySelector<HTMLElement>('.boss');
      const player = document.querySelector<HTMLElement>('.player');

      if (!boss || !player) return { bossLeft: 0, playerLeft: 0 };

      const bossLeft = parseFloat(boss.style.left || '0');
      const playerLeft = parseFloat(player.style.left || '0');

      return { bossLeft, playerLeft };
    });

    if (bulletExists) {
      // Move once to dodge the bullet
      if (playerLeft < bossLeft) {
        await page.keyboard.press('ArrowRight');
      } else if (playerLeft > bossLeft) {
        await page.keyboard.press('ArrowLeft');
      }

    } else {
      // Move player toward boss and spam space
      if (playerLeft < bossLeft) {
        await page.keyboard.press('ArrowRight');
      } else if (playerLeft > bossLeft) {
        await page.keyboard.press('ArrowLeft');
      }

      await page.keyboard.press('Space'); // spam attack
    }
  }
}

test('open website and shows start button', async ({ page }) => {
  

  await startGame(page);
  await office(page);
  await dockingBay(page);
  await submarine(page);
  await crash1(page);
  await crash2(page);
  await escape(page);
  await cave(page);
  await boss(page);
  
});

//left, .boss