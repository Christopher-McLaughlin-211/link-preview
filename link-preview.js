/**
 * Copyright 2025 Christopher-McLaughlin-211
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview`
 * 
 * @demo index.html
 * @element link-preview
 */
export class LinkPreview extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview";
  }

  constructor() {
    super();
    this.title = "";
    this.image = "";
    this.description = "";
    this.url = "";
    this.loading = false;
    this.fancy = false;
    this.metadata = {}
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      image: { type: String},
      description: {type: String},
      url: {type: String},
      loading: { type: Boolean, Reflect: true },
      fancy: { type: Boolean, Reflect: true },
      metadata: { type: Object},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .card {
         width: 350px;
         border-radius: 8px;
         margin: 20px auto;
         box-shadow: 0px 4px 12px black;
         text-align: center;
         padding: 16px;
         background-color: white;
      }
      .cardheader {
        font-size: 20px;
        margin-bottom: 10px;
        height: auto;
        color: black;
      }
      .card img {
        max-width: 200px;
        border-radius: 5px;
        margin-top: 10px;
      }
      button {
        margin-top: 16px;
        margin-bottom: 16px;
        background-color: white; 
        color: black; 
        border: 1px solid gray; 
        padding: 10px 16px; 
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover {
        background-color: black; 
        color: white; 
        transition: 0.4s;
      } 
      .description { 
        margin-top: 16px;
        font-size: 16px; 
        color: black;
      }
      details {
        color: black;
        padding: 10px 16px;
        border-radius: 5px;
        cursor: pointer;
      }
      details p {
        color: black;
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-label-font-size, var(--ddd-font-size-s));
      }
    `];
  }

  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      this.loading = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    const json = await response.json();
    console.log(json.data);

    this.metadata = json.data
    this.title = json.data["og:title"] || json.data["title"];
    this.image = json.data["og:image"] || json.data["logo"] || ["image"];
    this.description = json.data["og:description"];
    this.url = json.data["og:url"];
    
    console.log(json.data['url']);
    if (json.data['cool:card']) {
    }

  } catch (error) {
    console.error (error.message);
  }
}

updated(changedProperties) {
  if (changedProperties.has("url")) {
    this.getData(this.url); 
  }
}

openChanged(e) {
  console.log(e.newState);
  this.fancy = e.newState === "open"
}


  // Lit render the HTML
  render() {

    return html`
      <div class="card">
        <h1 class="cardheader">${this.title}</h1>
        <img src=${this.image} alt=${this.title} />
        <div class="description">
          <slot>${this.description}</slot>
        </div>
        <a href=${this.url} target="_blank">
          <button class="btn"><em>Go to Website</em></button>
        </a>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreview.tag, LinkPreview);
