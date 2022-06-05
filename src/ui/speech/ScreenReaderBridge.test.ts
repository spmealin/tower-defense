import { ScreenReaderBridge } from "./ScreenReaderBridge";

test("Basic string", () => {
    const div = document.createElement("div");
    const screenReaderBridge = new ScreenReaderBridge(div);
    expect(div.childElementCount).toBe(0);
    expect(screenReaderBridge.lastCreatedElement).toBeNull();
    const testString = "test string";
    screenReaderBridge.render(testString);
    expect(div.childElementCount).toBe(1);
    // Test getting the element through the DOM.
    let child = div.children[0];
    let renderedText = child.textContent;
    let attributeText = child.getAttribute(
        ScreenReaderBridge.ORIGINAL_TEXT_ATTRIBUTE
    );
    expect(renderedText).toBe(testString);
    expect(attributeText).toBe(testString);
    // Test getting the element through the speech renderer.
    if (!screenReaderBridge.lastCreatedElement) {
        throw new Error(
            "The last created element was null when it shouldn't have been."
        );
    }
    child = screenReaderBridge.lastCreatedElement;
    renderedText = child.textContent;
    attributeText = child.getAttribute(
        ScreenReaderBridge.ORIGINAL_TEXT_ATTRIBUTE
    );
    expect(renderedText).toBe(testString);
    expect(attributeText).toBe(testString);
});

test("Padding works", () => {
    const div = document.createElement("div");
    const screenReaderBridge = new ScreenReaderBridge(div);
    expect(div.childElementCount).toBe(0);
    const testString = "test string";
    screenReaderBridge.render(testString);
    expect(screenReaderBridge.lastCreatedElement?.textContent).toBe(testString);
    // Render again so padding is applied.
    screenReaderBridge.render(testString);
    // Ensure the string is not the same since it should have padding.
    expect(screenReaderBridge.lastCreatedElement?.textContent).not.toBe(
        testString
    );
    // Ensure that the padded string is longer than the original string.
    expect(
        screenReaderBridge.lastCreatedElement?.textContent?.length
    ).toBeGreaterThan(testString.length);
    // Make sure that the original sstring without the padding still matches.
    expect(
        screenReaderBridge.lastCreatedElement?.getAttribute(
            ScreenReaderBridge.ORIGINAL_TEXT_ATTRIBUTE
        )
    ).toBe(testString);
});

test("Removing hidden children works", async () => {
    const div = document.createElement("div");
    const screenReaderBridge = new ScreenReaderBridge(div);
    expect(div.childElementCount).toBe(0);
    const testString = "test string";
    screenReaderBridge.render(testString);
    screenReaderBridge.render(testString);
    screenReaderBridge.render(testString);
    screenReaderBridge.render(testString);
    // There should be 1 visible and 3 hidden children.
    expect(div.childElementCount).toBe(4);
    // Sleep for 30 milliseconds.
    await new Promise((r) => setTimeout(r, 30));
    // There should still be 1 visible and 3 hidden children.
    expect(div.childElementCount).toBe(4);
    screenReaderBridge.render(testString);
    // Now there should only be 1 visible and 1 hidden child.
    expect(div.childElementCount).toBe(2);
});

test("adding aria attributes", () => {
    const div = document.createElement("div");
    expect(div.hasAttribute("aria-live")).toBeFalsy();
    expect(div.hasAttribute("roll")).toBeFalsy();
    expect(div.hasAttribute("aria-atomic")).toBeFalsy();
    expect(div.hasAttribute("aria-relevant")).toBeFalsy();
    ScreenReaderBridge.addAriaAttributes(div);
    expect(div.hasAttribute("aria-live")).toBeTruthy();
    expect(div.hasAttribute("roll")).toBeTruthy();
    expect(div.hasAttribute("aria-atomic")).toBeTruthy();
    expect(div.hasAttribute("aria-relevant")).toBeTruthy();
});
