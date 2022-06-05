/**
 * An internal interface which keeps track of a priority and value in the priority queue.
 */
interface Item<T> {
    priority: number;
    value: T;
}

/** The first element in the heap */
const HEAD = 0;

/**
 * A min-priority queue.
 * When you add an item with a given priority to this queue, it will automatically sort itself. When you remove an item,
 * it will always return the item with the lowest priority value.
 */
export class MinPriorityQueue<T> {
    private _heap: Item<T>[] = [];

    /**
     * Get the size of the priority queue.
     *
     * @readonly
     */
    get size(): number {
        return this._heap.length;
    }

    /**
     *Is this priority queue empty?
     *
     * @readonly
     */
    get isEmpty(): boolean {
        return this._heap.length === 0;
    }

    /**
     * Get the first item in the priority queue without removing it.
     *
     * @returns - the first item in the priority queue
     */
    peek(): T {
        return this._heap[0].value;
    }

    /**
     *  Push an item into this queue with the given priority.
     *
     * @param value - the value to put in the priority queue
     * @param priority - the priority of the value
     */
    push(value: T, priority: number): void {
        this._heap.push({ value: value, priority: priority });
        // Move the element to the proper place in the heap depending on the priority.
        let curIndex = this._heap.length - 1;
        let parentIndex = this._parent(curIndex);
        while (curIndex > HEAD && this._moreImportant(curIndex, parentIndex)) {
            this._swapElements(curIndex, parentIndex);
            curIndex = parentIndex;
            parentIndex = this._parent(curIndex);
        }
    }

    /**
     * Remove the most important item from this queue.
     *
     * @returns the most important item
     */
    pop(): T {
        const retValue = this._heap[HEAD].value;
        if (this._heap.length > 1) {
            this._swapElements(HEAD, this._heap.length - 1);
        }
        this._heap.pop();
        // Make sure everything is where it should be depending on priority.
        let currentIndex = HEAD;
        let leftChildIndex = this._leftChildIndex(currentIndex);
        let rightChildIndex = this._rightChildIndex(currentIndex);
        // The next while statement checks if the current element has children, and if it does, see if either of them are more
        // important than the current element.
        while (
            (this._heap[leftChildIndex] &&
                this._moreImportant(leftChildIndex, currentIndex)) ||
            (this._heap[rightChildIndex] &&
                this._moreImportant(rightChildIndex, currentIndex))
        ) {
            // At least one of the current element's children is more important, so figure out which one.
            let childIndexToSwapWith: number;
            if (
                this._heap[leftChildIndex] &&
                this._moreImportant(leftChildIndex, currentIndex)
            ) {
                childIndexToSwapWith = leftChildIndex;
            } else {
                childIndexToSwapWith = rightChildIndex;
            }
            this._swapElements(currentIndex, childIndexToSwapWith);
            currentIndex = childIndexToSwapWith;
            leftChildIndex = this._leftChildIndex(currentIndex);
            rightChildIndex = this._rightChildIndex(currentIndex);
        }
        // Balance has been restored to the force... if the force is this heap.
        return retValue;
    }

    /**
     * Get the parent index of an element.
     *
     * @param i - the index of the element
     * @returns the parent index
     */
    private _parent(i: number): number {
        // The below is the same as:
        // Math.floor( ((i+1) / 2) - 1 )
        // but probably faster since we use a bit shift (">>>") instead of a function call.
        return ((i + 1) >> 1) - 1;
    }

    /**
     * Get the index of the left child of an element.
     *
     * @param i - the index of the element
     * @returns the index of the left child
     */
    private _leftChildIndex(i: number): number {
        // This is the same as:
        // 2*i+1
        // but maybe a bit faster?
        return (i << 1) + 1;
    }

    /**
     * Get the index of the right child of an element.
     *
     * @param i - the index of the element
     * @returns the index of the right child
     */
    private _rightChildIndex(i: number): number {
        // This is the same as:
        // 2*i+2
        // but maybe a bit faster?
        return (i << 1) + 2;
    }

    /**
     * Determine if a given element is more important than another element.
     * Since this is hardcoded as a min-priority queue, this will return if the priority of the first element is less than the priority of the second element.
     *
     * @param i1 - the index of the first element
     * @param i2 - the index of the second element
     * @returns true if the first element is more important than the second element
     */
    private _moreImportant(i1: number, i2: number): boolean {
        // Use "less than" for a minheap, meaning that things with a lower priority value are more important.
        return this._heap[i1].priority < this._heap[i2].priority;
    }

    /**
     * Swap the position of two elements in the heap.
     *
     * @param i1 - the first index
     * @param i2 - the second index
     */
    private _swapElements(i1: number, i2: number): void {
        const temp = this._heap[i1];
        this._heap[i1] = this._heap[i2];
        this._heap[i2] = temp;
    }
}
