import { MinPriorityQueue } from "./MinPriorityQueue";

test("Basic useage", () => {
    const q = new MinPriorityQueue<string>();
    expect(q.isEmpty).toBeTruthy();
    expect(q.size).toBe(0);
    q.push("d", 4);
    q.push("a", 1);
    q.push("c", 3);
    q.push("b", 2);
    expect(q.isEmpty).toBeFalsy();
    expect(q.size).toBe(4);
    ["a", "b", "c"].forEach((value) => {
        expect(q.peek()).toBe(value);
        expect(q.pop()).toBe(value);
    });
    expect(q.isEmpty).toBeFalsy();
    expect(q.size).toBe(1);
    expect(q.peek()).toBe("d");
    expect(q.pop()).toBe("d");
    expect(q.isEmpty).toBeTruthy();
    expect(q.size).toBe(0);
});
