export function greetingFor(date: Date): string {
    const hour = date.getHours();

    if (hour < 5) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';

    return 'Good evening';
}

export function formatLongDate(date: Date, locale?: string): string {
    return new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}
