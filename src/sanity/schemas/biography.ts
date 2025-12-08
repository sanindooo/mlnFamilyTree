import { defineField, defineType } from "sanity";

export const biographyType = defineType({
	name: "biography",
	title: "Biography (Deprecated) ⚠️",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "person",
			title: "Person",
			type: "reference",
			to: [{ type: "person" }],
			description: "Link to the person this biography is about",
		}),
		defineField({
			name: "content",
			title: "Content",
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
									{ title: "16:9 (Landscape)", value: "16/9" },
									{ title: "1:1 (Square)", value: "1/1" },
									{ title: "3:4 (Portrait)", value: "3/4" },
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
					],
				},
			],
			description: "Additional photos for the biography page",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "person.name",
		},
	},
});
