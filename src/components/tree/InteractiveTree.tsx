"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Person } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BiChevronRight, BiChevronDown } from "react-icons/bi";

interface TreeBranchProps {
	node: Person;
	depth?: number;
}

const TreeBranch = ({ node, depth = 0 }: TreeBranchProps) => {
	const [isOpen, setIsOpen] = useState(true);
	const hasChildren = node.children && node.children.length > 0;

	return (
		<div
			className={cn(
				"flex flex-col",
				depth > 0 && "ml-6 border-l border-warm-sand pl-4"
			)}
		>
			<div className="flex items-center py-2 group">
				{hasChildren && (
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="mr-2 p-1 rounded hover:bg-warm-sand/20 text-deep-umber transition-colors"
						aria-label={isOpen ? "Collapse" : "Expand"}
					>
						{isOpen ? <BiChevronDown /> : <BiChevronRight />}
					</button>
				)}
				{!hasChildren && <span className="w-6 mr-2" />} {/* Spacer */}
				<div className="flex items-center gap-3">
					{node.photo && (
						<Image
							src={node.photo}
							alt={node.name}
							width={32}
							height={32}
							className="size-8 rounded-full object-cover border border-warm-sand sepia-[.3]"
						/>
					)}
					<div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
						{node.slug && node.hasBioOrGallery ? (
							<Link
								href={`/member/${node.slug}`}
								className="font-medium text-deep-umber hover:text-burgundy transition-colors"
							>
								{node.name}
							</Link>
						) : (
							<span className="font-medium text-deep-umber/70">
								{node.name}
							</span>
						)}
						{node.birthDate && (
							<span className="text-xs text-muted">{node.birthDate}</span>
						)}
					</div>
				</div>
			</div>

			{hasChildren && isOpen && (
				<div className="flex flex-col">
					{node.children!.map((child) => (
						<TreeBranch key={child.id} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
};

interface InteractiveTreeProps {
	tree: Person;
}

export function InteractiveTree({ tree }: InteractiveTreeProps) {
	return (
		<section className="py-16 bg-white">
			<div className="container max-w-4xl mx-auto">
				<div className="border border-warm-sand rounded-xl p-6 md:p-8 bg-cream/10 shadow-sm">
					<TreeBranch node={tree} />
				</div>
			</div>
		</section>
	);
}
