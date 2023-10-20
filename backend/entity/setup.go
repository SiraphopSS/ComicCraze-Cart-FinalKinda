package entity

import (
	"gorm.io/driver/sqlite"

	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa-66.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect database")
	}
	database.AutoMigrate(
		&Member{},
		&Basket{},
		&Comic{},
		&Payment{},
		&Appove{},
		&Status{},
		&Admin{},
		&Category{},
		&Review{},
		&Rating{},
	)

	db = database

	One := Rating{
		Score: 1,
	}
	db.Model(&Rating{}).Create(&One)

	Two := Rating{
		Score: 2,
	}
	db.Model(&Rating{}).Create(&Two)

	Three := Rating{
		Score: 3,
	}
	db.Model(&Rating{}).Create(&Three)

	foun := Rating{
		Score: 4,
	}
	db.Model(&Rating{}).Create(&foun)

	fine := Rating{
		Score: 5,
	}
	db.Model(&Rating{}).Create(&fine)

	action := Category{
		Name: "Action",
	}
	db.Model(&Category{}).Create(&action)

	drama := Category{
		Name: "Drama",
	}
	db.Model(&Category{}).Create(&drama)

	male := Gender{
		Name: "Male",
	}
	db.Model(&Gender{}).Create(&male)

	female := Gender{
		Name: "Female",
	}
	db.Model(&Gender{}).Create(&female)

	member1 := Member{
		Email:    "testSubject@gmail.com",
		Username: "TestSubject01",
		Password: "1234",
	}
	db.Model(&Member{}).Create(&member1)
}

// Migrate the schema

// Sucess := Status{
// 	Status: "ชำระเงินแล้ว",
// }
// db.Model(&Status{}).Create(&Sucess)

// Wait := Status{
// 	Status: "รอการตรวจสอบ",
// }
// db.Model(&Status{}).Create(&Wait)

// unsuc := Status{
// 	Status: "ชำระเงินไม่สำเร็จ",
// }
// db.Model(&Status{}).Create(&unsuc)
// action := Category{
// 	Name: "แอคชั่น",
// }
// db.Model(&Category{}).Create(&action)

// drama := Category{
// 	Name: "ดราม่า",
// }
// db.Model(&Category{}).Create(&drama)
// admin := Admin{
// 	Email : "t@gmail.com",
// 	Password: "1234",
// }
// db.Model(&Admin{}).Create(&admin)
