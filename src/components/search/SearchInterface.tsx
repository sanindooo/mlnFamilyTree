"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Biography, SearchResult } from "@/types";
import { rankDocuments, highlightTerms, makeSnippet } from "@/lib/search";
import { BiSearch } from "react-icons/bi";

interface SearchInterfaceProps {
	documents: Biography[];
}

export function SearchInterface({ documents }: SearchInterfaceProps) {
	const [query, setQuery] = useState("");

	const results: SearchResult[] = useMemo(() => {
		if (!query.trim()) return [];
		return rankDocuments(documents, query);
	}, [documents, query]);

	const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

	return (
		<section className="py-16 md:py-24 lg:py-28 bg-white min-h-[60vh]">
			<div className="container max-w-2xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold font-serif text-deep-umber mb-4">
						Search the Archive
					</h1>
					<p className="text-deep-umber/80">
						Explore biographies, stories, and family history.
					</p>
				</div>

				<div className="relative mb-12">
					<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
						<BiSearch className="text-muted size-5" />
					</div>
					<Input
						type="search"
						placeholder="Search for names, places, or events..."
						className="pl-10 h-12 text-lg border-warm-sand focus:border-burgundy focus:ring-burgundy"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{query && results.length === 0 && (
					<p className="text-center text-muted">
						No results found for "{query}"
					</p>
				)}

				<ul className="space-y-8 list-none m-0 p-0">
					{results.map(({ doc, score }) => {
						// Create snippet
						const snippetRaw = makeSnippet(doc.rawContent, 3); // First 3 lines as base
						const snippet = highlightTerms(snippetRaw, terms);

						return (
							<li
								key={doc.slug}
								className="border-b border-warm-sand pb-8 last:border-0"
							>
								<article>
									<a
										href={
											doc.slug === "mln-story"
												? "/mln-story"
												: `/member/${doc.slug}`
										}
										className="group"
									>
										<h2 className="text-2xl font-serif font-bold text-deep-umber group-hover:text-burgundy mb-2">
											{doc.title}
										</h2>
									</a>
									<div
										className="text-deep-umber/80 leading-relaxed"
										dangerouslySetInnerHTML={{ __html: snippet }}
									/>
									<div className="mt-3">
										<span className="text-xs text-muted uppercase tracking-wider">
											Relevance: {score}
										</span>
									</div>
								</article>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
