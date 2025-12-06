import { getBiography, getDocsIndex } from "@/lib/data";
import { BiographyHeader } from "@/components/biography/BiographyHeader";
import { BiographyContent } from "@/components/biography/BiographyContent";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const docs = await getDocsIndex();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bio = await getBiography(slug);

  if (!bio) {
    notFound();
  }

  // Get photos for header if available in docs
  const docs = await getDocsIndex();
  const docEntry = docs.find(d => d.slug === slug);
  const heroImage = docEntry?.photos?.[0] || "/placeholder-image.svg";

  return (
    <>
      <BiographyHeader 
        title={bio.title} 
        imageSrc={heroImage}
        category="Family Member"
      />
      <BiographyContent content={bio.content} />
      
      {/* Link to view their position in the family tree */}
      <section className="bg-warm-sand/20 py-12 md:py-16 border-t border-warm-sand">
        <div className="container text-center">
          <h2 className="text-2xl font-serif font-bold text-deep-umber mb-4 md:text-3xl">
            Explore the Family Tree
          </h2>
          <p className="text-deep-umber mb-6 max-w-2xl mx-auto">
            See {bio.title.split(' ')[0]}'s position in the Nsibirwa family lineage and explore their connections
          </p>
          <Button asChild variant="secondary">
            <a href="/tree">View Family Tree</a>
          </Button>
        </div>
      </section>
    </>
  );
}
