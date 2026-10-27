// Renders one or more schema.org blocks as JSON-LD. "<" is escaped so text can never close the tag.
export default function JsonLd({ data }: { data: object | object[] }) {
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
