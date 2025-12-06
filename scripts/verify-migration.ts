import { client } from './utils/sanityClient'

async function verify() {
  console.log('🕵️‍♀️ Verifying migration data...\n')

  try {
    // Check People
    const peopleCount = await client.fetch('count(*[_type == "person"])')
    console.log(`People: ${peopleCount} (Expected: 25)`)

    // Check Biographies
    const bioCount = await client.fetch('count(*[_type == "biography"])')
    console.log(`Biographies: ${bioCount} (Expected: 6)`)

    // Check Gallery Images
    const galleryCount = await client.fetch('count(*[_type == "galleryImage"])')
    console.log(`Gallery Images: ${galleryCount}`)

    // Check Timeline Events
    const timelineCount = await client.fetch('count(*[_type == "timelineEvent"])')
    console.log(`Timeline Events: ${timelineCount} (Expected: 5)`)

    // Check Parent-Child Relationships
    const rootPerson = await client.fetch(`
      *[_type == "person" && slug.current == "martin-luther-nsibirwa"][0] {
        name,
        "childrenCount": count(children)
      }
    `)
    
    if (rootPerson) {
      console.log(`Root Person: ${rootPerson.name}`)
      console.log(`Children Linked: ${rootPerson.childrenCount} (Expected: 24)`)
    } else {
      console.error('❌ Root person not found!')
    }

    // Check Biography Links
    const biosWithPerson = await client.fetch(`
      count(*[_type == "biography" && defined(person)])
    `)
    console.log(`Biographies linked to Person: ${biosWithPerson} (Expected: 6)`)

  } catch (error) {
    console.error('Verification failed:', error)
  }
}

verify()

