import PropertyDetailsView from "@/components/properties/PropertyDetailsView"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

    return (
        <section className="container-space py-40 h-fit w-full">
            <PropertyDetailsView slug={slug} />
        </section>
    )
}