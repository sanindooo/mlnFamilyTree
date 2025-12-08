import { defineField, defineType } from "sanity";

export const personType = defineType({
	name: "person",
	title: "👤 Person",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Full Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "birthDate",
			title: "Birth Date",
			type: "string",
			description:
				'Can be a year (e.g., "1883") or full date (e.g., "1929-05-10")',
		}),
		defineField({
			name: "deathDate",
			title: "Death Date",
			type: "string",
			description: 'Can be a year (e.g., "1945") or full date',
		}),
		defineField({
			name: "photo",
			title: "Portrait Photo",
			type: "image",
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alternative text",
					description: "Important for SEO and accessibility",
				},
			],
		}),
		defineField({
			name: "children",
			title: "Children",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "person" }],
				},
			],
			description: "References to this person's children",
		}),
		// Merged Biography Fields
		defineField({
			name: "bioTitle",
			title: "Biography Title",
			type: "string",
			description:
				"Title for the biography page (e.g., 'The Roots That Held Them Steady')",
		}),
		defineField({
			name: "content",
			title: "Biography Content",
			type: "array",
			of: [
				{
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H1", value: "h1" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
						{ title: "Quote", value: "blockquote" },
					],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
						],
						annotations: [
							{
								name: "link",
								type: "object",
								title: "Link",
								fields: [
									{
										name: "href",
										type: "url",
										title: "URL",
									},
								],
							},
						],
					},
				},
				{
					type: "image",
					options: { hotspot: true },
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternative text",
						},
						{
							name: "caption",
							type: "string",
							title: "Caption",
						},
						{
							name: "aspectRatio",
							type: "string",
							title: "Aspect Ratio",
							options: {
								list: [
									{ title: "16:9 (Video)", value: "16/9" },
									{ title: "1:1 (Square)", value: "1/1" },
									{ title: "3:4 (Portrait)", value: "3/4" },
									{ title: "4:3 (Landscape)", value: "4/3" },
									{ title: "Original", value: "original" },
								],
							},
							initialValue: "16/9",
						},
					],
				},
			],
		}),
		defineField({
			name: "gallery",
			title: "Photo Gallery",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "galleryImage" }],
				},
			],
			description:
				"References to photos in the main gallery. Creating a new item here adds it to the global gallery.",
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "birthDate",
			media: "photo",
		},
	},
});
