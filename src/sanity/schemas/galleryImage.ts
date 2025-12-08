import { defineField, defineType } from "sanity";

export const galleryImageType = defineType({
	name: "galleryImage",
	title: "🖼️ Gallery Image",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alternative text",
					validation: (rule) => rule.required(),
				},
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "category" }],
				},
			],
			description: "Categories/Tags for this image",
		}),
		defineField({
			name: "relatedPeople",
			title: "Related People",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "person" }],
				},
			],
			description: "People featured in this photo",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
			media: "image",
		},
	},
});
