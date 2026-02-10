export function randomMaybeElement<Elements extends unknown[]>(
	elements: Elements,
): Elements[number] | undefined {
	const index = Math.floor(Math.random() * elements.length);
	return elements[index];
}

export function randomElement<Elements extends [unknown, ...unknown[]]>(
	elements: Elements,
): Elements[number] {
	// SAFETY: because there is always at least one element, undefined will never be returned
	return randomMaybeElement(elements) as Elements[number];
}
