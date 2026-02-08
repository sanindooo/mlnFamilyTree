import { defineField, defineType } from "sanity";

export const footerCTAType = defineType({
	name: "footerCTA",
	title: "🔗 Footer CTA",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: "Main heading for the footer CTA section",
		}),
		defineField({
			name: "text",
			title: "Text",
			type: "text",
			rows: 3,
			description: "Description text shown below the title",
		}),
		defineField({
			name: "backgroundImage",
			title: "Background Image",
			type: "image",
			options: { hotspot: true },
			description: "Optional background image. If not set, the default image will be used.",
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alternative text",
					description: "Describe the image for accessibility",
				},
			],
		}),
		defineField({
			name: "primaryButton",
			title: "Primary Button",
			type: "object",
			description: "Primary button settings. Both text and link must be set for the button to appear.",
			fields: [
				defineField({
					name: "text",
					title: "Button Text",
					type: "string",
					description: "Text displayed on the primary button",
				}),
				defineField({
					name: "link",
					title: "Link",
					type: "string",
					description: "URL or internal path for the primary button",
				}),
				defineField({
					name: "openInNewTab",
					title: "Open in New Tab",
					type: "boolean",
					description: "If checked, the link will open in a new browser tab",
					initialValue: false,
				}),
			],
		}),
		defineField({
			name: "secondaryButton",
			title: "Secondary Button",
			type: "object",
			description: "Secondary button settings. Both text and link must be set for the button to appear.",
			fields: [
				defineField({
					name: "text",
					title: "Button Text",
					type: "string",
					description: "Text displayed on the secondary button",
				}),
				defineField({
					name: "link",
					title: "Link",
					type: "string",
					description: "URL or internal path for the secondary button",
				}),
				defineField({
					name: "openInNewTab",
					title: "Open in New Tab",
					type: "boolean",
					description: "If checked, the link will open in a new browser tab",
					initialValue: false,
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "text",
			media: "backgroundImage",
		},
	},
});
