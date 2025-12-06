import { getBiography, getAllBiographies, getFamilyTree, getDocsIndex } from "@/lib/data";
import { findNodeBySlug } from "@/lib/tree";
import { BiographyHeader } from "@/components/biography/BiographyHeader";
import { BiographyContent } from "@/components/biography/BiographyContent";
import { RelatedStories } from "@/components/biography/RelatedStories";
import { InteractiveTree } from "@/components/tree/InteractiveTree";
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
  const fullTree = await getFamilyTree();
  const memberNode = findNodeBySlug(fullTree, slug);

  if (!bio) {
    notFound();
  }

  // Get photos for gallery/header if available in docs
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
      <BiographyContent content={bio.content}>
         {/* Add photo gallery grid here if photos exist */}
         {docEntry?.photos && docEntry.photos.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 not-prose">
              {docEntry.photos.slice(1).map((photo, index) => (
                <img 
                  key={index} 
                  src={photo} 
                  alt={`${bio.title} photo ${index + 2}`} 
                  className="rounded-xl border border-warm-sand sepia-[.3] w-full h-64 object-cover"
                />
              ))}
            </div>
         )}
      </BiographyContent>
      
      {/* Show subtree if they have children */}
      {memberNode && memberNode.children && memberNode.children.length > 0 && (
        <section className="bg-cream/20 py-16">
           <div className="container text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-deep-umber">Immediate Family Tree</h2>
           </div>
           <InteractiveTree tree={memberNode} />
        </section>
      )}

      <RelatedStories />
    </>
  );
}

