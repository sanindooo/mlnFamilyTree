import { defineField, defineType } from "sanity";

export const timelineEventType = defineType({
	name: "timelineEvent",
	title: "🕒 Timeline Event",
	type: "document",
	fields: [
		defineField({
			name: "year",
			title: "Year / Period",
			type: "string",
			description: 'e.g. "1883", "1920s", "1930s-1940s"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "date",
			title: "Precise Date",
			type: "date",
			description: "Optional precise date for sorting",
		}),
		defineField({
			name: "displayOrder",
			title: "Display Order",
			type: "number",
			description: "Order in which to display the event (1, 2, 3...)",
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
				},
			],
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
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "year",
			media: "image",
		},
		prepare({ title, subtitle, media }) {
			return {
				title,
				subtitle: subtitle,
				media,
			};
		},
	},
});
