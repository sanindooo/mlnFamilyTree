import { defineField, defineType } from "sanity";

export const grandchildType = defineType({
	name: "grandchild",
	title: "👶 Grandchildren",
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
			name: "photo",
			title: "Photo",
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
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
			description: "A short description about this grandchild",
		}),
		defineField({
			name: "linkedinUrl",
			title: "LinkedIn URL",
			type: "url",
			validation: (rule) =>
				rule.uri({
					scheme: ["http", "https"],
				}),
		}),
		defineField({
			name: "twitterUrl",
			title: "Twitter/X URL",
			type: "url",
			validation: (rule) =>
				rule.uri({
					scheme: ["http", "https"],
				}),
		}),
		defineField({
			name: "order",
			title: "Display Order",
			type: "number",
			description: "Lower numbers appear first",
			initialValue: 0,
		}),
	],
	preview: {
		select: {
			title: "name",
			media: "photo",
		},
	},
});
