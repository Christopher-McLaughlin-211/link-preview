import { html, fixture, expect } from '@open-wc/testing';
import "../link-preview.js";

describe("LinkPreview test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <link-preview
        title="title"
      ></link-preview>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
